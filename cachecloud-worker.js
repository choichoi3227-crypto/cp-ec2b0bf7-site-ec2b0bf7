/**
 * CacheCloud — CloudPress 엣지 캐시 Worker (자동 생성)
 * CloudFront와 동일하게 오리진(미러링 Worker) 응답을 캐시합니다.
 */
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const origin = env.ORIGIN_URL || "https://cp-ec2b0bf7-wp.workers.dev";
    if (!origin) return new Response("CacheCloud: ORIGIN_URL 없음", { status: 503 });
    const cache = caches.default;
    const key = new Request(url.toString(), req);
    const cached = await cache.match(key);
    if (cached) {
      const h = new Headers(cached.headers);
      h.set("X-CacheCloud", "HIT");
      return new Response(cached.body, { status: cached.status, headers: h });
    }
    const res = await fetch(origin + url.pathname + url.search, {
      method: req.method,
      headers: req.headers,
      cf: { cacheEverything: true, cacheTtl: 300 },
    });
    const out = new Response(res.body, res);
    out.headers.set("X-CacheCloud", "MISS");
    if (res.ok && (req.method === "GET" || req.method === "HEAD")) {
      ctx.waitUntil(cache.put(key, out.clone()));
    }
    return out;
  },
};
