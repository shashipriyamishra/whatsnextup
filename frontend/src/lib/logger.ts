/**
 * Structured Logging Service
 * Centralized logging with consistent format
 * Can be extended to send logs to external services (Datadog, Sentry, etc.)
 */

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogMetadata {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private isProduction = process.env.NODE_ENV === "production"

  /**
   * Format log message with timestamp and metadata
   */
  private format(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
  ): string {
    const timestamp = new Date().toISOString()
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
  }

  /**
   * Send log to external service in production
   */
  private sendToService(level: LogLevel, message: string, metadata?: any) {
    if (!this.isProduction) return

    // TODO: Send to logging service (Datadog, Sentry, CloudWatch, etc.)
    // Example: Sentry.captureMessage(message, { level, extra: metadata })
  }

  /**
   * Info level - general information
   */
  info(message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      console.log(this.format("info", message, metadata))
    }
    this.sendToService("info", message, metadata)
  }

  /**
   * Warn level - potential issues
   */
  warn(message: string, metadata?: LogMetadata) {
    console.warn(this.format("warn", message, metadata))
    this.sendToService("warn", message, metadata)
  }

  /**
   * Error level - errors that need attention
   */
  error(message: string, error?: any, metadata?: LogMetadata) {
    const errorData = {
      ...metadata,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
    console.error(this.format("error", message, errorData))
    this.sendToService("error", message, errorData)
  }

  /**
   * Debug level - detailed information for debugging
   */
  debug(message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      console.debug(this.format("debug", message, metadata))
    }
  }

  /**
   * Log API call
   */
  api(method: string, url: string, status?: number, duration?: number) {
    const metadata = {
      method,
      url,
      status,
      duration: duration ? `${duration}ms` : undefined,
    }

    if (status && status >= 400) {
      this.error(`API Error: ${method} ${url}`, undefined, metadata)
    } else if (this.isDevelopment) {
      this.info(`API: ${method} ${url}`, metadata)
    }
  }

  /**
   * Log user action
   */
  userAction(action: string, metadata?: LogMetadata) {
    this.info(`User Action: ${action}`, metadata)
  }

  /**
   * Log performance metric
   */
  performance(metric: string, value: number, unit: string = "ms") {
    this.info(`Performance: ${metric}`, { value, unit })
  }
}

// Export singleton instance
export const logger = new Logger()
