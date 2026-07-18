export default {
  fetch(): Response {
    return new Response("Hello from Cloudflare Workers!");
  },
} satisfies ExportedHandler;