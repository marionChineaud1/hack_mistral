import { createError, defineEventHandler, getHeader, readBody } from "h3";

import { downloadAndTranscribe } from "../utils/download-and-transcribe";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.transcriptionToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "NUXT_TRANSCRIPTION_TOKEN is not configured.",
    });
  }

  if (getHeader(event, "authorization") !== `Bearer ${config.transcriptionToken}`) {
    throw createError({
      statusCode: 401,
      statusMessage: "A valid bearer token is required.",
    });
  }

  const body = await readBody<{ url?: unknown }>(event);
  if (
    typeof body?.url !== "string"
    || !body.url.trim()
    || body.url.length > 2_048
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid url field of at most 2048 characters is required.",
    });
  }

  if (!config.mistralApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "MISTRAL_API_KEY is not configured.",
    });
  }

  try {
    return await downloadAndTranscribe({
      sourceUrl: body.url.trim(),
      apiKey: config.mistralApiKey,
    });
  } catch (error) {
    throw createError({
      statusCode: 422,
      statusMessage: error instanceof Error ? error.message : "Unable to transcribe video.",
    });
  }
});
