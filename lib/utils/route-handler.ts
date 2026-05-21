import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors/handle-error";
import { buildSuccessResponse } from "@/lib/errors/error-response";

type RouteHandler<T> = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withErrorHandling<T>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

export function jsonSuccess<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200
): NextResponse {
  return NextResponse.json(buildSuccessResponse(data, meta), { status });
}
