import { afterEach, describe, expect, it, vi } from "vitest";

import worker from "./index";

describe("Worker routes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects URLs that are not X post URLs before rendering or transcribing", async () => {
    const response = await worker.fetch(
      new Request("https://worker.test/?url=https%3A%2F%2Fexample.com%2Fvideo"),
      {} as Env,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "The url parameter must be an X post URL.",
    });
  });

  it("accepts the direct parsing route without calling Browser Rendering", async () => {
    const response = await worker.fetch(
      new Request("https://worker.test/test/parse", { method: "POST" }),
      {} as Env,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "The test endpoint expects multipart form data",
    });
  });

  it("requires an uploaded Markdown file on the direct parsing route", async () => {
    const response = await worker.fetch(
      new Request("https://worker.test/test/parse", {
        method: "POST",
        body: new FormData(),
      }),
      {} as Env,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing required Markdown file field: file",
    });
  });

  it("requires an X post URL on the direct parsing route", async () => {
    const form = new FormData();
    form.set("file", new File(["post markdown"], "post.md", { type: "text/markdown" }));

    const response = await worker.fetch(
      new Request("https://worker.test/test/parse", {
        method: "POST",
        body: form,
      }),
      {} as Env,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "A valid X post URL is required in the url field or query parameter",
    });
  });

  it("reaches parsing configuration instead of falling through to a 405", async () => {
    const form = new FormData();
    form.set("file", new File(["post markdown"], "post.md", { type: "text/markdown" }));
    form.set("url", "https://x.com/example/status/123");

    const response = await worker.fetch(
      new Request("https://worker.test/test/parse", {
        method: "POST",
        body: form,
      }),
      {} as Env,
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "MISTRAL_API_KEY is not configured.",
    });
  });
});
