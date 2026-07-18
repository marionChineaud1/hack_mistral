import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { promisify } from "node:util";

import { createOpenAI } from "@ai-sdk/openai";
import { transcribe } from "ai";

const execFile = promisify(execFileCallback);
const DOWNLOAD_TIMEOUT_MS = 5 * 60_000;
const MAX_SUBPROCESS_OUTPUT_BYTES = 1_000_000;

export type DownloadedVideo = {
  localPath: string;
  sourceUrl: string;
};

export type VideoTranscription = {
  source_url: string;
  video: {
    file_name: string;
  };
  transcript: string;
  transcription: {
    language: string | null;
    duration_seconds: number | null;
    segments: Array<{
      text: string;
      start_second: number;
      end_second: number;
    }>;
  };
};

export function normalizeXVideoUrl(value: string): URL {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (
    url.protocol !== "https:"
    || url.username
    || url.password
    || url.port
    || (hostname !== "x.com" && hostname !== "twitter.com")
    || !/^\/[^/]+\/status\/\d+\/video\/\d+\/?$/.test(url.pathname)
  ) {
    throw new Error("The video URL must be an HTTPS X post video URL.");
  }

  url.hostname = "x.com";
  url.search = "";
  url.hash = "";
  return url;
}

function localVideoPath(stdout: string): string {
  const path = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  if (!path) {
    throw new Error("yt-dlp completed without reporting the downloaded file path.");
  }
  return path;
}

export async function downloadVideo(
  sourceUrl: string,
  outputDirectory = resolve(process.cwd(), "downloads"),
): Promise<DownloadedVideo> {
  const url = normalizeXVideoUrl(sourceUrl);
  await mkdir(outputDirectory, { recursive: true });

  const { stdout } = await execFile("yt-dlp", [
    "--no-playlist",
    "--no-progress",
    "--max-filesize",
    "100M",
    "--merge-output-format",
    "mp4",
    "--print",
    "after_move:filepath",
    "--output",
    resolve(outputDirectory, "%(title)s [%(id)s].%(ext)s"),
    url.toString(),
  ], {
    timeout: DOWNLOAD_TIMEOUT_MS,
    maxBuffer: MAX_SUBPROCESS_OUTPUT_BYTES,
  });

  return { localPath: localVideoPath(stdout), sourceUrl: url.toString() };
}

export async function downloadAndTranscribe({
  sourceUrl,
  apiKey,
  outputDirectory = resolve(process.cwd(), "downloads"),
}: {
  sourceUrl: string;
  apiKey: string;
  outputDirectory?: string;
}): Promise<VideoTranscription> {
  const video = await downloadVideo(sourceUrl, outputDirectory);
  const mistral = createOpenAI({
    apiKey,
    baseURL: "https://api.mistral.ai/v1",
  });
  try {
    const result = await transcribe({
      // Mistral exposes this OpenAI-compatible endpoint for Voxtral transcription.
      model: mistral.transcription("voxtral-mini-latest"),
      audio: await readFile(video.localPath),
    });

    return {
      source_url: video.sourceUrl,
      video: {
        file_name: basename(video.localPath),
      },
      transcript: result.text,
      transcription: {
        language: result.language ?? null,
        duration_seconds: result.durationInSeconds ?? null,
        segments: result.segments.map((segment) => ({
          text: segment.text,
          start_second: segment.startSecond,
          end_second: segment.endSecond,
        })),
      },
    };
  }
  finally {
    try {
      await rm(video.localPath, { force: true });
    }
    catch (error) {
      console.error("Unable to delete the temporary video file.", error);
    }
  }
}
