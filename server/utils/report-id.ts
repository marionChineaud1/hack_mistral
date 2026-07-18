import { z } from "zod";

const reportIdSchema = z.uuid();

export function parseReportId(value: unknown): string | null {
  const result = reportIdSchema.safeParse(value);
  return result.success ? result.data : null;
}
