# X Post Context MCP

This project exposes an MCP tool that turns an X post into structured context. A Cloudflare Browser Rendering Worker renders the post, Mistral extracts its fields, and the Nuxt server can download and transcribe an attached video with Voxtral.

## Architecture

- `server/mcp/tools/get-url-context.ts` defines the MCP tool and validates Worker responses.
- `.browser/src/index.ts` renders and structures X posts in a Cloudflare Worker.
- `server/api/transcribe.post.ts` provides the authenticated transcription endpoint.
- `server/utils/download-and-transcribe.ts` runs `yt-dlp` and sends audio to Mistral.

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
