import { createError } from "h3";

import type { ReportDto } from "~~/shared/types/report";
import { parseReportId } from "../utils/report-id";

export async function readReport(
  rawId: unknown,
  findReport: (id: string) => Promise<ReportDto | null>,
): Promise<ReportDto> {
  const id = parseReportId(rawId);
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "INVALID_REPORT_ID",
      message: "L’identifiant du rapport doit être un UUID valide.",
    });
  }

  const report = await findReport(id);
  if (!report) {
    throw createError({
      statusCode: 404,
      statusMessage: "REPORT_NOT_FOUND",
      message: "Aucun rapport ne correspond à cet identifiant.",
    });
  }
  return report;
}
