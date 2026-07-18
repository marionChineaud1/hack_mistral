import { describe, expect, it } from "vitest";

import { normalizeXVideoUrl } from "./download-and-transcribe";

describe("normalizeXVideoUrl", () => {
  it("keeps a canonical X video URL and removes tracking data", () => {
    expect(
      normalizeXVideoUrl(
        "https://x.com/example/status/123456789/video/1?s=20#player",
      ).toString(),
    ).toBe("https://x.com/example/status/123456789/video/1");
  });

  it("normalizes legacy Twitter URLs", () => {
    expect(
      normalizeXVideoUrl(
        "https://www.twitter.com/example/status/123456789/video/2",
      ).toString(),
    ).toBe("https://x.com/example/status/123456789/video/2");
  });

  it.each([
    "http://x.com/example/status/123456789/video/1",
    "https://example.com/example/status/123456789/video/1",
    "https://x.com/example/status/123456789",
    "https://x.com:444/example/status/123456789/video/1",
    "https://user:password@x.com/example/status/123456789/video/1",
  ])("rejects unsupported or unsafe URLs: %s", (url) => {
    expect(() => normalizeXVideoUrl(url)).toThrow(
      "The video URL must be an HTTPS X post video URL.",
    );
  });

  it("rejects malformed URLs", () => {
    expect(() => normalizeXVideoUrl("not a URL")).toThrow();
  });
});
