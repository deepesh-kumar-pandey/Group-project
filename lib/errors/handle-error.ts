import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";
import { buildErrorResponse } from "./error-response";
import { logger } from "./logger";

export function handleError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    if (error.statusCode >= 500) {
      logger.error(error.message, { code: error.code, details: error.details });
    }
    return NextResponse.json(buildErrorResponse(error), {
      status: error.statusCode,
    });
  }

  if (error instanceof ZodError) {
    const apiError = ApiError.badRequest("Validation failed", {
      issues: error.flatten(),
    });
    return NextResponse.json(buildErrorResponse(apiError), { status: 400 });
  }

  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack });
  } else {
    logger.error("Unknown error", { error });
  }

  const internal = ApiError.internal();
  return NextResponse.json(buildErrorResponse(internal), { status: 500 });
}
