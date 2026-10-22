export default {
  async fetch(request, env, ctx) {
    // 1. Tangani Preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
      });
    }

    // 2. Ambil URL target
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "URL target tidak ada" }), { 
        status: 400, headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const fetchOptions = {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };

      if (request.method === "POST") {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = await request.text();
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.text();

      return new Response(data, {
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Worker Error: " + error.message }), {
        status: 500, headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
