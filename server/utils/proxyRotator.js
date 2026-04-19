/**
 * Proxy Rotator
 *
 * Configure via environment variable:
 *   PROXY_LIST=http://user:pass@host1:port,http://user:pass@host2:port
 *
 * If PROXY_LIST is empty, all helpers return null/empty (direct connection).
 * For Naukri and LinkedIn, proxies are strongly recommended.
 */

const rawList = (process.env.PROXY_LIST || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

let cursor = 0;

function nextProxy() {
  if (!rawList.length) return null;
  return rawList[cursor++ % rawList.length];
}

/** Returns an axios-compatible proxy config object, or {} if no proxies configured */
function axiosProxy() {
  const proxy = nextProxy();
  if (!proxy) return {};
  try {
    const u = new URL(proxy);
    return {
      proxy: {
        protocol: u.protocol.replace(":", ""),
        host: u.hostname,
        port: parseInt(u.port, 10),
        ...(u.username && {
          auth: { username: u.username, password: u.password },
        }),
      },
    };
  } catch {
    return {};
  }
}

/** Returns a `--proxy-server=...` string for Puppeteer args, or null if no proxies */
function puppeteerProxyArg() {
  const proxy = nextProxy();
  return proxy ? `--proxy-server=${proxy}` : null;
}

/** Returns [user, pass] for puppeteer page.authenticate(), or null */
function puppeteerAuth() {
  const proxy = nextProxy();
  if (!proxy) return null;
  try {
    const u = new URL(proxy);
    return u.username ? [u.username, u.password] : null;
  } catch {
    return null;
  }
}

module.exports = { axiosProxy, puppeteerProxyArg, puppeteerAuth };
