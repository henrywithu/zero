interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** Keep Safari/media seeking reliable when Static Assets returns a full body for Range. */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const path = new URL(request.url).pathname;
    if (!/^\/assets\/(audio|videos)\//.test(path) || response.status !== 200)
      return response;

    const headers = new Headers(response.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    const fullResponse = () =>
      new Response(response.body, { status: 200, headers });
    const range = request.headers.get("Range");
    const ifRange = request.headers.get("If-Range");
    if (request.method !== "GET" || !range) return fullResponse();
    if (
      ifRange &&
      (ifRange.startsWith("W/") ||
        (ifRange !== headers.get("ETag") &&
          ifRange !== headers.get("Last-Modified")))
    )
      return fullResponse();

    // Multiple ranges may be ignored by HTTP servers; serve the complete file.
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) return fullResponse();
    const body = await response.arrayBuffer();
    const size = body.byteLength;
    const start = match[1]
      ? Number(match[1])
      : Math.max(0, size - Number(match[2]));
    const end = match[1]
      ? match[2]
        ? Math.min(Number(match[2]), size - 1)
        : size - 1
      : size - 1;
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start >= size ||
      start > end ||
      (!match[1] && Number(match[2]) === 0)
    ) {
      headers.set("Content-Range", `bytes */${size}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    const slice = body.slice(start, end + 1);
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(slice.byteLength));
    return new Response(slice, { status: 206, headers });
  },
};
