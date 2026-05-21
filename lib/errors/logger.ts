type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  return JSON.stringify(payload);
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage("debug", message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    console.info(formatMessage("info", message, context));
  },

  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage("warn", message, context));
  },

  error(message: string, context?: LogContext): void {
    console.error(formatMessage("error", message, context));
  },
};
