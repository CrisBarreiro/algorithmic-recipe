// Second lock behind Cloudflare Access.
//
// Every request must carry a valid Cloudflare Access login token (the Cf-Access-Jwt-Assertion header,
// or the CF_Authorization cookie) signed by this account's Access team and issued for one of this
// site's Access applications. Anything else gets a 403, so a hostname that is ever left out of
// Access shows an error instead of the recipes.
//
// Settings (Pages project → Settings → Variables and secrets, Production, type Text):
//   ACCESS_TEAM_DOMAIN  your team domain, e.g. example.cloudflareaccess.com
//   ACCESS_AUD          the Application Audience (AUD) tag of each Access app, comma-separated
// If either is missing, every request is refused (fail closed).
//
// /brand/ (the login page logo) is the only path served without a token.

const PUBLIC_PREFIXES = ["/brand/"];
const CERTS_TTL_MS = 60 * 60 * 1000;
let certsCache = { domain: "", keys: null, at: 0 };

const HELP = {
  "not-configured": "ACCESS_TEAM_DOMAIN or ACCESS_AUD is not set for this deployment (Production variables, then redeploy).",
  "no-token": "No Cloudflare Access login token reached the site. Is this hostname covered by an Access application?",
  "verify-error": "Could not load the signing keys from ACCESS_TEAM_DOMAIN. Check it is the full team domain, e.g. example.cloudflareaccess.com.",
  issuer: "The token comes from a different team domain than ACCESS_TEAM_DOMAIN.",
  audience: "The token is for an Access application whose AUD tag is not in ACCESS_AUD.",
  expired: "The login has expired. Log in again.",
};

function deny(reason, detail = "") {
  const help = HELP[reason] || "The login token is not valid.";
  return new Response(`Forbidden (${reason})\n\n${help}${detail ? `\n\n${detail}` : ""}\n`, {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai",
      "X-Deny-Reason": reason,
    },
  });
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

function readToken(request) {
  const h = request.headers.get("Cf-Access-Jwt-Assertion");
  if (h) return h;
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return m ? m[1] : null;
}

async function getKeys(domain, refresh = false) {
  const fresh = certsCache.domain === domain && certsCache.keys && Date.now() - certsCache.at < CERTS_TTL_MS;
  if (fresh && !refresh) return certsCache.keys;
  const res = await fetch(`https://${domain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`certs ${res.status}`);
  const { keys } = await res.json();
  certsCache = { domain, keys: keys || [], at: Date.now() };
  return certsCache.keys;
}

async function verify(token, domain, auds) {
  const parts = token.split(".");
  if (parts.length !== 3) return "malformed";
  let header, payload;
  try {
    header = b64urlJson(parts[0]);
    payload = b64urlJson(parts[1]);
  } catch {
    return "malformed";
  }
  if (header.alg !== "RS256") return "alg";

  let keys = await getKeys(domain);
  let jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) {
    keys = await getKeys(domain, true); // keys rotate; refetch once
    jwk = keys.find((k) => k.kid === header.kid);
  }
  if (!jwk) return "kid";

  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!ok) return "signature";

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp < now) return "expired";
  if (typeof payload.nbf === "number" && payload.nbf > now + 60) return "not-yet-valid";
  if (payload.iss !== `https://${domain}`) return "issuer";
  const tokenAuds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!tokenAuds.some((a) => auds.includes(a))) return "audience";
  return null;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const path = new URL(request.url).pathname;
  if (PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return next();

  let domain = (env.ACCESS_TEAM_DOMAIN || "").trim().replace(/^["']|["']$/g, "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (domain && !domain.includes(".")) domain += ".cloudflareaccess.com"; // just the team name was given
  const auds = (env.ACCESS_AUD || "").split(/[\s,]+/).map((s) => s.replace(/^["']|["']$/g, "")).filter(Boolean);
  if (!domain || auds.length === 0) return deny("not-configured");

  const token = readToken(request);
  if (!token) return deny("no-token");

  let problem;
  try {
    problem = await verify(token, domain, auds);
  } catch (e) {
    return deny("verify-error", `Team domain used: ${domain}`);
  }
  if (problem === "issuer" || problem === "audience") {
    // Show what the token carries next to what is configured; neither value is secret.
    let p = {};
    try { p = b64urlJson(token.split(".")[1]); } catch {}
    const detail = problem === "issuer"
      ? `Token issuer: ${p.iss}\nExpected: https://${domain}`
      : `Token AUD: ${[].concat(p.aud).join(", ")}\nACCESS_AUD has ${auds.length} value(s), starting: ${auds.map((a) => a.slice(0, 8) + "…").join(", ")}`;
    return deny(problem, detail);
  }
  if (problem) return deny(problem);
  return next();
}
