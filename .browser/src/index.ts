export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET" },
      });
    }

    const url = new URL(request.url).searchParams.get("url");

    if (!url) {
      return new Response("Missing required query parameter: url", { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return new Response("The url parameter must be a valid URL", { status: 400 });
    }

    if (target.protocol !== "http:" && target.protocol !== "https:") {
      return new Response("The url parameter must use HTTP or HTTPS", { status: 400 });
    }

    return env.BROWSER.quickAction("markdown", { url: target.toString() });
  },
} satisfies ExportedHandler<Env>;
