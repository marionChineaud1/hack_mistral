import { describe, expect, it, vi } from "vitest";

import type { ReportDto } from "../../shared/types/report";
import { readReport } from "./read-report";

const id = "a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df";

describe("readReport", () => {
  it("rejects malformed UUIDs before querying the repository", async () => {
    const findReport = vi.fn();
    await expect(readReport("invalid", findReport)).rejects.toMatchObject({ statusCode: 400, statusMessage: "INVALID_REPORT_ID" });
    expect(findReport).not.toHaveBeenCalled();
  });

  it("returns a not-found error for an unknown UUID", async () => {
    await expect(readReport(id, async () => null)).rejects.toMatchObject({ statusCode: 404, statusMessage: "REPORT_NOT_FOUND" });
  });

  it("returns the repository DTO unchanged", async () => {
    const report = { id } as ReportDto;
    await expect(readReport(id, async () => report)).resolves.toBe(report);
  });
});
