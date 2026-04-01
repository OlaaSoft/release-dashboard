// Cloudflare Worker: App Store Connect API sync
// Fetches latest released versions for each app and returns JSON

const ISSUER_ID = '6f97f195-2b9a-428d-be76-216f381fc49e';
const KEY_ID = 'CUUZ34P955';

// Base64url encode
function b64url(buf) {
  const str = typeof buf === 'string' ? btoa(buf) : btoa(String.fromCharCode(...new Uint8Array(buf)));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Import P8 private key
async function importKey(pem) {
  const b64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8', bin,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
}

// Create JWT for App Store Connect API
async function createJWT(privateKeyPem) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const payload = {
    iss: ISSUER_ID,
    iat: now,
    exp: now + 1200, // 20 min
    aud: 'appstoreconnect-v1',
  };

  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const sigInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const key = await importKey(privateKeyPem);
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key, sigInput
  );

  // Convert DER signature to raw r||s (64 bytes)
  const derSig = new Uint8Array(sig);
  let r, s;
  if (derSig[0] === 0x30) {
    // DER format
    let offset = 2;
    const rLen = derSig[offset + 1];
    r = derSig.slice(offset + 2, offset + 2 + rLen);
    offset += 2 + rLen;
    const sLen = derSig[offset + 1];
    s = derSig.slice(offset + 2, offset + 2 + sLen);
    // Pad/trim to 32 bytes
    r = r.length > 32 ? r.slice(r.length - 32) : new Uint8Array([...new Array(32 - r.length).fill(0), ...r]);
    s = s.length > 32 ? s.slice(s.length - 32) : new Uint8Array([...new Array(32 - s.length).fill(0), ...s]);
  } else {
    // Already raw
    r = derSig.slice(0, 32);
    s = derSig.slice(32, 64);
  }

  const rawSig = new Uint8Array([...r, ...s]);
  return `${headerB64}.${payloadB64}.${b64url(rawSig)}`;
}

// Fetch app versions from App Store Connect
async function fetchAppVersion(jwt, appId) {
  const url = `https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions?filter[appStoreState]=READY_FOR_SALE&limit=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const version = json.data?.[0];
  if (!version) return null;
  return {
    version: version.attributes.versionString,
    state: version.attributes.appStoreState,
    releaseDate: version.attributes.createdDate,
  };
}

export default {
  async fetch(request, env) {
    // CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const privateKey = env.ASC_PRIVATE_KEY;
      if (!privateKey) {
        return new Response(JSON.stringify({ error: 'Missing ASC_PRIVATE_KEY' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Apps to check — add more as they get published
      const apps = JSON.parse(env.ASC_APPS || '{}');

      const jwt = await createJWT(privateKey);
      const results = {};

      for (const [appId, appName] of Object.entries(apps)) {
        const ver = await fetchAppVersion(jwt, appId);
        if (ver) {
          results[appName] = {
            version: ver.version,
            releaseDate: ver.releaseDate,
            state: ver.state,
          };
        }
      }

      return new Response(JSON.stringify(results, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
