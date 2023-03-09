
import { ConsoleLogger, Inject, Injectable, LogLevel, Scope } from '@nestjs/common'
import { LoggerConfig, NEST_LOGGER_CONFIG, NEST_LOGGER_WRITER } from './logger.config'
import { LogWriterService } from './log-writer.service'

// Type alias for a message supplier function
export type MessageSupplier = () => string

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {

  /**
   * Logger service. Logs LOGGING_LEVEL to stdout, but only logs error and warn
   * log events to LOG_FILE
   *
   * @param {string} [context]
   * @memberof LoggerService
   */
  constructor(
    @Inject(NEST_LOGGER_CONFIG) private readonly config: LoggerConfig,
    @Inject(NEST_LOGGER_WRITER) private readonly writer: LogWriterService) {
    super()
  }

  /**
   * Log a VERBOSE level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if VERBOSE level is enabled
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  verbose(messageSupplier: MessageSupplier, context?: string): void
  /**
   * Log a VERBOSE level message
   *
   * @param {*} message the message to be logged
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  verbose(message: string, context?: string): void
  verbose(message: any, context?: string): void {
    if (this.isFileLoggingEnabled('verbose'))
      this.dump(message, 'VERB', context)
    if (this.config.stdout.enabled)
      super.verbose.call(this, typeof message == 'function' ? message() : message)
  }

  /**
   * Log a DEBUG level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if DEBUG level is enabled
   * @param {string} [context]
   * @memberof LoggerService
   */
  debug(messageSupplier: MessageSupplier, context?: string): void
  /**
   * Log a DEBUG level message
   *
   * @param {*} message the message to be logged
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  debug(message: string, context?: string): void
  debug(message: any, context?: string): void {
    if (this.isFileLoggingEnabled('debug'))
      this.dump(message, 'DEBUG', context)
    if (this.config.stdout.enabled)
      super.debug.call(this, typeof message == 'function' ? message() : message)
  }

  /**
   * Log a INFO level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if INFO level is enabled
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  log(messageSupplier: MessageSupplier, context?: string): void
  /**
   * Log a INFO level message
  *
  * @param {*} message
  * @param {string} [context]
  * @memberof LoggerService
  */
  log(message: string, context?: string): void
  log(message: any, context?: string): void {
    if (this.isFileLoggingEnabled('log'))
      this.dump(message, 'INFO', context)
    if (this.config.stdout.enabled)
      super.log.call(this, typeof message == 'function' ? message() : message)
  }

  /**
   * Log a WARN level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if WARN level is enabled
   * @param {string} [context]
   * @memberof LoggerService
   */
  warn(messageSupplier: MessageSupplier, context?: string): void
  /**
   * Log a WARN level message
   *
   * @param {*} message
   * @param {string} [context]
   * @memberof LoggerService
   */
  warn(message: string, context?: string): void
  warn(message: any, context?: string): void {
    if (this.isFileLoggingEnabled('warn'))
      this.dump(message, 'WARN', context)
    if (this.config.stdout.enabled)
      super.warn.call(this, typeof message == 'function' ? message() : message)
  }

  /**
   * Log an ERROR level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if ERROR level is enabled
   * @param {string} [stack] optional stack trace
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  error(messageSupplier: MessageSupplier, stack?: string, context?: string): void
  /**
   * Log an ERROR level message
   *
   * @param {*} message the message to be logged
   * @param {string} [stack] optional stack trace
   * @param {string} [context] optional context
   * @memberof LoggerService
   */
  error(message: string, stack?: string, context?: string): void
  error(message: any, stack?: string, context?: string): void {
    if (this.isFileLoggingEnabled('error'))
      this.dump(message, 'ERROR', stack)
    if (this.config.stdout.enabled) {
      super.error.call(this, typeof message == 'function' ? message() : message)
      if (stack)
        console.error(stack)
    }
  }

  /**
   * Dumps a logging entry to disk
   *
   * @param {*} message
   * @param {string} [stack]
   * @memberof LoggerService
   */
  private dump(message: any, level: string, stack?: string) {
    this.writer.write(
      JSON.stringify({
        date: new Date().toISOString(),
        context: this.context,
        level,
        message: typeof message == 'function' ? message() : message,
        stack,
      }) + this.config.file.eol,
    )
  }

  /**
   * Determine if file logging is enabled for a given level
   *
   * @private
   * @param {LogLevel} level
   * @memberof LoggerService
   */
  private isFileLoggingEnabled(level: LogLevel) {
    return this.config.file.enabled
      && this.config.file.level.includes(level)
  }
}
