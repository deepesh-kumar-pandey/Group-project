export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "EXTERNAL_API_ERROR"
  | "AI_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(message, 403, "FORBIDDEN");
  }

  static notFound(message: string): ApiError {
    return new ApiError(message, 404, "NOT_FOUND");
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, 409, "CONFLICT");
  }

  static rateLimited(message = "Rate limit exceeded"): ApiError {
    return new ApiError(message, 429, "RATE_LIMITED");
  }

  static externalApi(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(message, 502, "EXTERNAL_API_ERROR", details);
  }

  static aiError(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(message, 502, "AI_ERROR", details);
  }

  static database(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(message, 500, "DATABASE_ERROR", details);
  }

  static internal(message = "Internal server error"): ApiError {
    return new ApiError(message, 500, "INTERNAL_ERROR");
  }
}
