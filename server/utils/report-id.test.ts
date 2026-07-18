import { describe, expect, it } from "vitest";

import { parseReportId } from "./report-id";

describe("parseReportId", () => {
  it("accepts a valid UUID", () => {
    expect(parseReportId("a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df")).toBe("a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df");
  });

  it.each([undefined, "", "north", "a3d2f92c-feb4-4c8f-9c1e"])("rejects invalid report ids: %s", (value) => {
    expect(parseReportId(value)).toBeNull();
  });
});
