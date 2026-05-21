import { ApiError, type ErrorCode } from "./api-error";

export interface ErrorResponseBody {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function buildErrorResponse(error: ApiError): ErrorResponseBody {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  };
}

export interface SuccessResponseBody<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export function buildSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): SuccessResponseBody<T> {
  return meta ? { success: true, data, meta } : { success: true, data };
}
