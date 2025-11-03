/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Log levels for categorizing log messages
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/** Contextual information to include with log messages */
type LogContext = Record<string, unknown>;

/** Structure of a log entry */
interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private readonly minLevel: LogLevel = LogLevel.INFO;
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Determines if a message should be logged based on the current log level
   * @param level - The log level of the message
   * @returns True if the message should be logged, false otherwise
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.minLevel);
    const requestedLevelIndex = levels.indexOf(level);
    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * Formats a log entry into a string
   * @param entry - The log entry to format
   * @returns The formatted log string
   */
  private formatLogEntry(entry: LogEntry): string {
    const parts = [`[${entry.timestamp}]`, `[${entry.level}]`, entry.message];

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(`\nError: ${entry.error.message}`);
      if (entry.error.stack && this.isDevelopment) {
        parts.push(`\nStack: ${entry.error.stack}`);
      }
    }

    return parts.join(' ');
  }

  /**
   * Logs a message at the specified log level
   * @param level - The log level
   * @param message - The log message
   * @param context - Optional contextual information
   * @param error - Optional error object
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      error,
    };

    const formattedMessage = this.formatLogEntry(entry);

    // Output to appropriate console method based on level
    switch (level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  /**
   * Logs a debug message
   * @param message - The log message
   * @param context - Optional contextual information
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Logs an info message
   * @param message - The log message
   * @param context - Optional contextual information
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Logs a warning message
   * @param message - The log message
   * @param context - Optional contextual information
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Logs an error message
   * @param message - The log message
   * @param contextOrError - Optional contextual information or error object
   * @param error - Optional error object if context is provided
   */
  error(message: string, contextOrError?: LogContext | Error, error?: Error): void {
    if (contextOrError instanceof Error) {
      this.log(LogLevel.ERROR, message, undefined, contextOrError);
    } else {
      this.log(LogLevel.ERROR, message, contextOrError, error);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
