# Vera

Vera turns an X post into structured context and presents saved investigations in a readable Nuxt interface. Its report interface is in English, while research and source discovery remain French-language. The companion report UI uses a fully relational NuxtHub SQLite database and exposes reports through a read-only UUID API.

The seeded demonstration is available at `/`. It redirects to:

`/reports/a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df`

## Architecture

- `server/mcp/tools/get-url-context.ts` defines the MCP tool and validates Worker responses.
- `.browser/src/index.ts` renders and structures X posts in a Cloudflare Worker.
- `server/api/transcribe.post.ts` provides the authenticated transcription endpoint.
- `server/utils/download-and-transcribe.ts` runs `yt-dlp` and sends audio to Mistral.
- `server/db/schema.ts` defines the relational investigation report model.
- `server/api/reports/[id].get.ts` returns one saved report by UUID.
- `app/pages/reports/[id].vue` renders the light, reading-focused report interface.

Only HTTPS X post video URLs are accepted by the transcription endpoint. Downloads are limited to 100 MB and five minutes.

## Requirements

- Node.js 20 or newer
- pnpm
- `yt-dlp` available on `PATH`
- A Mistral API key
- A Cloudflare account with Browser Rendering enabled

## Setup

Install dependencies:

```sh
pnpm install
```

Copy `.env.example` to `.env` and configure:

- `NUXT_MISTRAL_API_KEY`: Mistral key used by Voxtral.
- `NUXT_TRANSCRIPTION_TOKEN`: a strong shared secret protecting the transcription endpoint.
- `NUXT_BROWSER_WORKER_URL`: deployed Browser Worker URL.

Copy `.browser/.dev.vars.example` to `.browser/.dev.vars` and configure:

- `MISTRAL_API_KEY`: Mistral key used to parse rendered Markdown.
- `NITRO_TRANSCRIPTION_URL`: public URL ending in `/api/transcribe`.
- `NITRO_TRANSCRIPTION_TOKEN`: the same value as `NUXT_TRANSCRIPTION_TOKEN`.

For a deployed Worker, store these values as Wrangler secrets rather than plain configuration variables.

## Development

Run Nuxt:

```sh
pnpm dev
```

NuxtHub applies committed migrations automatically in development and production builds. To manage them explicitly:

```sh
pnpm db:generate
pnpm db:migrate
```

The standalone `1000_demo_report.sqlite.sql` migration seeds the original French research material, and `1001_vera_demo_report.sqlite.sql` translates the report copy for Vera’s English interface. `north-report.html` is retained only as the original visual reference.

Retrieve a report with:

`GET /api/reports/:id`

The endpoint returns `400` for malformed UUIDs and `404` for unknown reports. Report creation, updates, authentication, and external ingestion are intentionally deferred.

Run the Worker in another terminal:

```sh
pnpm --dir .browser dev
```

The MCP server is exposed by the Nuxt MCP toolkit. The Worker accepts `GET /?url=<x-post-url>`. Its `POST /test/parse` route accepts multipart fields named `file` and `url` for testing extraction from saved Markdown without Browser Rendering.

## Validation

```sh
pnpm test
pnpm build
pnpm --dir .browser check
pnpm --dir .browser test
```
