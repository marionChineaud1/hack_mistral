import { describe, expect, it } from "vitest";

import worker from "./index";

describe("Worker routes", () => {
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
});
