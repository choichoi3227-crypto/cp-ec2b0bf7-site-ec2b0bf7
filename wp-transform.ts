/**
 * wp-transform.ts — CloudPress WordPress PHP 실시간 실행 브릿지
 * 이 파일이 PHP 요청을 PHP_RUNNER에 위임하고 HTML/JSON을 그대로 응답합니다.
 */

const GH_OWNER    = 'choichoi3227-crypto';
const GH_REPO     = 'cp-ec2b0bf7-site-ec2b0bf7';
const SITE_URL    = 'https://cp-ec2b0bf7-wp.workers.dev';
const SITE_ID     = 'ec2b0bf7-6ba0-4964-9221-ee499a6791a4';
const GH_RAW_BASE = 'https://raw.githubusercontent.com/choichoi3227-crypto/cp-ec2b0bf7-site-ec2b0bf7/main';

const STATIC_EXT = /\.(css|js|jpg|jpeg|png|gif|webp|avif|svg|ico|woff2?|ttf|eot|otf|map|txt|xml|pdf|zip|mp4|mp3|ogg|wav|webm)$/i;
const WP_PHP_PATHS = /^\/wp-(admin|login\.php|cron\.php|json|comments|signup|activate|trackback|xmlrpc\.php|mail\.php|blog-header\.php|load\.php|settings\.php)(\/|$|\?)/;
const WP_PHP_FILES = /^\/wp-(login|cron|xmlrpc|mail|blog-header|load|settings)\.php(\?|$)/;

const WP_PHP_ROUTES: Record<string, string> = {
  '/':            '/index.php',
  '/wp-login':    '/wp-login.php',
  '/wp-admin':    '/wp-admin/index.php',
  '/wp-admin/':   '/wp-admin/index.php',
  '/wp-json':     '/index.php',
  '/feed':        '/index.php',
  '/sitemap.xml': '/index.php',
  '/robots.txt':  '/robots.txt',
};

const SEC: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options':        'SAMEORIGIN',
  'Referrer-Policy':        'strict-origin-when-cross-origin',
};

function mime(p: string): string {
  const ext = (p.split('.').pop() || '').toLowerCase();
  const map: Record<string, string> = {
    css:'text/css;charset=utf-8', js:'application/javascript;charset=utf-8',
    json:'application/json;charset=utf-8', html:'text/html;charset=utf-8', php:'text/html;charset=utf-8',
    svg:'image/svg+xml', png:'image/png', jpg:'image/jpeg', gif:'image/gif', webp:'image/webp', ico:'image/x-icon',
  };
  return map[ext] || 'application/octet-stream';
}

function fixCharset(res: Response): Response {
  const ct = res.headers.get('Content-Type') || '';
  if (ct.includes('charset') || (!ct.includes('text/html') && !ct.includes('text/plain'))) return res;
  const h = new Headers(res.headers);
  h.set('Content-Type', ct.replace(/;\s*$/, '') + ';charset=utf-8');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

function ensureCharsetMeta(html: string): string {
  if (/charset/i.test(html.slice(0, 2000))) return html;
  return html.replace(/<head([^>]*)>/i, '<head$1>\n<meta charset="UTF-8">');
}

function resolvePhpFile(path: string): string {
  const clean = path.replace(/\/$/, '') || '/';
  if (WP_PHP_ROUTES[clean]) return WP_PHP_ROUTES[clean];
  if (path.endsWith('.php')) return path;
  if (path.startsWith('/wp-admin')) {
    return path.endsWith('/') ? path + 'index.php' : path + '/index.php';
  }
  if (!path.includes('.') || path.endsWith('/')) return '/index.php';
  return '/index.php';
}

async function ghRaw(filePath: string, token = '', ttl = 300): Promise<Response | null> {
  try {
    const res = await fetch(`${GH_RAW_BASE}/${filePath}`, {
      headers: {
        'User-Agent': 'CloudPress-wp-transform/2',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cf: { cacheEverything: true, cacheTtl: ttl } as RequestInit['cf'],
    });
    return res.ok ? res : null;
  } catch { return null; }
}

async function ghText(filePath: string, token = ''): Promise<string> {
  const res = await ghRaw(filePath, token, 120);
  return res ? await res.text() : '';
}

function wp404(): Response {
  return new Response('<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>404</title></head><body><h1>404</h1><a href="/">홈</a></body></html>',
    { status: 404, headers: { ...SEC, 'Content-Type': 'text/html;charset=utf-8' } });
}

interface Env {
  PHP_RUNNER?: { fetch(req: Request): Promise<Response> };
  CACHE?:      { get(k: string, t?: string): Promise<ArrayBuffer | string | null>; put(k: string, v: ArrayBuffer, opts?: object): Promise<void> };
  GITHUB_TOKEN?: string;
}

export default {
  async fetch(req: Request, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const url   = new URL(req.url);
    const path  = url.pathname;
    const isGet = req.method === 'GET' || req.method === 'HEAD';
    const token = env.GITHUB_TOKEN || '';
    const siteUrl = `${url.protocol}//${url.host}`;

    const needsPhp = !STATIC_EXT.test(path) && (WP_PHP_PATHS.test(path) || WP_PHP_FILES.test(path) || path === '/' || !path.includes('.') || path.endsWith('.php'));

    if (needsPhp && env.PHP_RUNNER) {
      try {
        let body = '';
        if (!isGet) body = await req.clone().text().catch(() => '');
        const phpFile = resolvePhpFile(path);
        const [wpConfig, dbPhp] = await Promise.all([
          ghText('wordpress/wp-config.php', token),
          ghText('wordpress/wp-content/db.php', token),
        ]);
        const payload = {
          phpFile,
          phpEnv: {
            WP_HOME: siteUrl, WP_SITEURL: siteUrl,
            REQUEST_URI: path + url.search, REQUEST_METHOD: req.method,
            HTTP_HOST: url.host, SERVER_NAME: url.host,
            HTTPS: url.protocol === 'https:' ? 'on' : '',
            DOCUMENT_ROOT: '/wordpress', SCRIPT_FILENAME: `/wordpress${phpFile}`,
            SCRIPT_NAME: phpFile, PHP_SELF: phpFile,
            HTTP_COOKIE: req.headers.get('Cookie') || '',
            HTTP_USER_AGENT: req.headers.get('User-Agent') || 'CloudPress',
            CONTENT_TYPE: req.headers.get('Content-Type') || '',
            CONTENT_LENGTH: String(body.length),
            QUERY_STRING: url.search.replace(/^\?/, ''),
            GITHUB_OWNER: GH_OWNER, GITHUB_REPO: GH_REPO, GITHUB_TOKEN: token,
          },
          stdin: body,
          files: {
            '/wordpress/wp-config.php': wpConfig,
            '/wordpress/wp-content/db.php': dbPhp,
          },
          siteConfig: { githubOwner: GH_OWNER, githubRepo: GH_REPO, ghPagesUrl: SITE_URL },
        };
        const phpRes = await env.PHP_RUNNER.fetch(new Request('https://php-runner/run-wordpress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }));
        if (phpRes.status < 500) return fixCharset(phpRes);
      } catch { /* PHP Runner 실패 → 캐시 폴백 */ }
    }

    if (isGet && !STATIC_EXT.test(path) && !WP_PHP_PATHS.test(path)) {
      let cp = '_cache' + path;
      if (cp.endsWith('/')) cp += 'index.html';
      else if (!cp.includes('.')) cp += '/index.html';
      let cached = await ghRaw(cp, token, 60);
      if (!cached) cached = await ghRaw('_cache' + path + '.html', token, 60);
      if (cached) {
        const html = ensureCharsetMeta(await cached.text());
        return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=60', ...SEC } });
      }
    }

    if (isGet && STATIC_EXT.test(path)) {
      const assetPath = (path.startsWith('/wp-content/') || path.startsWith('/wp-includes/') || path.startsWith('/wp-admin/'))
        ? 'wordpress' + path : path.slice(1);
      const res = await ghRaw(assetPath, token, 86400);
      if (res) {
        const buf = await res.arrayBuffer();
        if (env.CACHE) ctx.waitUntil(env.CACHE.put(`wp:${GH_OWNER}/${GH_REPO}:${path}`, buf, { expirationTtl: 86400 }));
        return new Response(buf, { headers: { 'Content-Type': mime(path), 'Cache-Control': 'public,max-age=604800,immutable', ...SEC } });
      }
    }

    if (isGet && SITE_URL) {
      try {
        const r = await fetch(SITE_URL + path + url.search);
        if (r.ok) return fixCharset(r);
      } catch {}
    }

    return wp404();
  },
};

export { WP_PHP_ROUTES, resolvePhpFile };
