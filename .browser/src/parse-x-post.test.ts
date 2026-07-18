import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  canonicalizeXPostUrl,
  extractExplicitMetrics,
  finalizeXPost,
  isVideoIndicated,
} from "./parse-x-post";

const fixturePath = resolve(dirname(fileURLToPath(import.meta.url)), "../output.md");
const canonicalUrl = "https://x.com/BFMTV/status/2070421512050364493";

describe("X post parsing helpers", () => {
  it("normalizes a supported X post URL and removes tracking parameters", () => {
    expect(
      canonicalizeXPostUrl(
        new URL("https://x.com/BFMTV/status/2070421512050364493?s=20"),
      ),
    ).toBe(canonicalUrl);
  });

  it("rejects URLs that are not X post URLs", () => {
    expect(canonicalizeXPostUrl(new URL("https://x.com/BFMTV"))).toBeNull();
    expect(
      canonicalizeXPostUrl(
        new URL("https://example.com/BFMTV/status/2070421512050364493"),
      ),
    ).toBeNull();
  });

  it("keeps the sample post fields and derives its first video view URL", async () => {
    const markdown = await readFile(fixturePath, "utf8");
    expect(markdown).toContain("@BFMTV");
    expect(markdown).toContain("Readers added context to this video");
    expect(isVideoIndicated(markdown)).toBe(true);
    expect(extractExplicitMetrics(markdown)).toEqual({
      replies: null,
      reposts: null,
      likes: null,
      bookmarks: null,
      views: 2_600_000,
    });

    const post = finalizeXPost(
      {
        post_content:
          '"Je suis horrifiée par les gens qui me disent qu\'il n\'y a qu\'à mettre la clim\' partout (...) Vous croyez que ça va éviter un feu de forêt, la mort des animaux ? ça n\'est pas de l\'adapation, c\'est une mesure d\'urgence", déclare la ministre Monique Barbut #BFM2',
        author: {
          display_name: "BFM",
          handle: "@BFMTV",
          profile_url: "https://x.com/BFMTV",
        },
        publication_date: "8:18 AM · Jun 26, 2026",
        has_video: true,
        community_notes_url:
          "https://twitter.com/i/birdwatch/n/2070488028234051661",
        metrics: {
          replies: null,
          reposts: null,
          likes: null,
          bookmarks: null,
          views: null,
        },
      },
      canonicalUrl,
    );

    expect(post.author?.handle).toBe("@BFMTV");
    expect(post.post_content).toContain("Je suis horrifiée");
    expect(post.community_notes_url).toContain("birdwatch");
    expect(post.publication_date).toBe("8:18 AM · Jun 26, 2026");
    expect(post.video_urls).toEqual([`${canonicalUrl}/video/1`]);
    expect(post.metrics).toEqual({
      replies: null,
      reposts: null,
      likes: null,
      bookmarks: null,
      views: null,
    });
  });
});
