import { createError, defineEventHandler, getRouterParam } from "h3";

import { getReportById } from "../../repositories/reports";
import { readReport } from "../../services/read-report";

export default defineEventHandler(async (event) => {
  try {
    return await readReport(getRouterParam(event, "id"), getReportById);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    console.error("Unable to retrieve report", error);
    throw createError({
      statusCode: 500,
      statusMessage: "REPORT_RETRIEVAL_FAILED",
      message: "Le rapport ne peut pas être chargé pour le moment.",
    });
  }
});
