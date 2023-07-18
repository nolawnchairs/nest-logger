
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
   * @memberof LoggerService
   */
  constructor(
    @Inject(NEST_LOGGER_CONFIG) private readonly config: LoggerConfig,
    @Inject(NEST_LOGGER_WRITER) private readonly writer: LogWriterService) {
    super()
  }

  /**
   * Log a VERBOSE level message
   *
   * @param {string} message the message to be logged
   * @param {...any[]} args optional arguments. Each will print to its own line. If the last argument is a string, that string will replace the context.
   * @memberof LoggerService
   */
  verbose(message: string, ...args: any[]): void {
    if (this.isConsoleLoggingEnabled('verbose')) {
      super.verbose.call(this, ...arguments)
    }
    if (this.isFileLoggingEnabled('verbose')) {
      this.dump(message, 'VERB', undefined, ...args)
    }
  }

  /**
   * Log a DEBUG level message
   *
   * @param {*} message the message to be logged
   * @param {...any[]} args optional arguments. Each will print to its own line. If the last argument is a string, that string will replace the context.
   * @memberof LoggerService
   */
  debug(message: string, ...args: any[]): void {
    if (this.isConsoleLoggingEnabled('debug')) {
      super.debug.call(this, ...arguments)
    }
    if (this.isFileLoggingEnabled('debug')) {
      this.dump(message, 'DEBUG', undefined, ...args)
    }
  }

  /**
   * Log a INFO level message
  *
  * @param {*} message the message to be logged
  * @param {...any[]} args optional arguments. Each will print to its own line. If the last argument is a string, that string will replace the context.
  * @memberof LoggerService
  */
  log(message: string, ...args: any[]) {
    if (this.isConsoleLoggingEnabled('log')) {
      super.log.call(this, ...arguments)
    }
    if (this.isFileLoggingEnabled('log')) {
      this.dump(message, 'INFO', undefined, ...args)
    }
  }

  /**
   * Log a WARN level message
   *
   * @param {string} message the message to be logged
   * @param {...any[]} args optional arguments. Each will print to its own line. If the last argument is a string, that string will replace the context.
   * @memberof LoggerService
   */
  warn(message: string, ...args: any[]): void {
    if (this.isConsoleLoggingEnabled('warn')) {
      super.warn.call(this, ...arguments)
    }
    if (this.isFileLoggingEnabled('warn')) {
      this.dump(message, 'WARN', undefined, ...args)
    }
  }

  /**
   * Log an ERROR level message
   *
   * @param {*} message the message to be logged
   * @param {string} [stack] optional stack trace
   * @param {...any[]} args optional arguments. Each will print to its own line. If the last argument is a string, that string will replace the context.
   * @memberof LoggerService
   */
  error(message: string, stack?: string, ...args: any[]): void {
    if (this.isConsoleLoggingEnabled('error')) {
      super.error.call(this, ...arguments)
    }
    if (this.isFileLoggingEnabled('error')) {
      if (this.isStackLike(stack)) {
        this.dump(message, 'ERROR', stack, ...args)
      } else {
        this.dump(message, 'ERROR', undefined, ...args)
      }
    }
  }

  /**
   * Dumps a logging entry to disk
   *
   * @param {*} message
   * @param {string} [stack]
   * @memberof LoggerService
   */
  private dump(message: any, level: string, stack?: string, ...args: any[]) {
    this.writer.write(
      JSON.stringify({
        date: new Date().toISOString(),
        context: this.context,
        level,
        message: typeof message == 'function' ? message() : message,
        // Ensure stack, if null, is undefined so it is not serialized
        stack: stack == 'string' ? stack.split('\n').map(s => s.trim()) : undefined,
        args: args?.length ? args : undefined,
      }) + this.config.file.eol,
    )
  }

  /**
   * Determine if console logging is enabled for a given level
   *
   * @private
   * @param {LogLevel} level
   * @return {*}  {boolean}
   * @memberof LoggerService
   */
  private isConsoleLoggingEnabled(level: LogLevel): boolean {
    return this.config.stdout.enabled
      && this.config.stdout.level.includes(level)
  }

  /**
   * Determine if file logging is enabled for a given level
   *
   * @private
   * @param {LogLevel} level
   * @return {*}  {boolean}
   * @memberof LoggerService
   */
  private isFileLoggingEnabled(level: LogLevel): boolean {
    return this.config.file.enabled
      && this.config.file.level.includes(level)
  }

  /**
   * Detect if a string is probably a stack trace
   *
   * @private
   * @param {string} value the string to test
   * @return {*}  {boolean}
   * @memberof LoggerService
   */
  private isStackLike(value: string): boolean {
    return typeof value == 'string' && /(.)+\n\s+at .+:\d+:\d+/.test(value)
  }
}
