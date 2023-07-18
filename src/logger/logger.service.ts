
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
   * Log a VERBOSE level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if VERBOSE level is enabled
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  verbose(messageSupplier: MessageSupplier, ...optionalParams: any[]): void
  /**
   * Log a VERBOSE level message
   *
   * @param {string} message the message to be logged
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  verbose(message: string, ...optionalParams: any[]): void
  verbose(message: any, ...optionalParams: any[]): void {
    // Although the underlying console-logger checks the log level, we must
    // check it here as well to prevent unnecessary evaluation of the message
    // supplier function
    if (this.isConsoleLoggingEnabled('verbose')) {
      // Although context is intrinsic to the instance, arguments passed to all
      // logging methods can override the logging context with the last
      // argument, so we must pass it explicitly as the last argument to the
      // super call. This affects all logging methods below.
      super.verbose(typeof message == 'function' ? message() : message, ...optionalParams, this.context)
    }
    if (this.isFileLoggingEnabled('verbose')) {
      this.dump(message, 'VERB', undefined, ...optionalParams)
    }
  }

  /**
   * Log a DEBUG level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if DEBUG level is enabled
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  debug(messageSupplier: MessageSupplier, ...optionalParams: any[]): void
  /**
   * Log a DEBUG level message
   *
   * @param {*} message the message to be logged
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  debug(message: string, ...optionalParams: any[]): void
  debug(message: any, ...optionalParams: any[]): void {
    if (this.isConsoleLoggingEnabled('debug')) {
      super.debug(typeof message == 'function' ? message() : message, ...optionalParams, this.context)
    }
    if (this.isFileLoggingEnabled('debug')) {
      this.dump(message, 'DEBUG', undefined, ...optionalParams)
    }
  }

  /**
   * Log a INFO/LOG level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if INFO level is enabled
   * @param {...any[]} optionalParams optional parameters to include
   * @memberof LoggerService
   */
  log(messageSupplier: MessageSupplier, ...optionalParams: any[]): void
  /**
   * Log a INFO level message
  *
  * @param {*} message the message to be logged
  * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
  * @memberof LoggerService
  */
  log(message: string, ...optionalParams: any[]): void
  log(message: any, ...optionalParams: any[]): void {
    if (this.isConsoleLoggingEnabled('log')) {
      super.log(typeof message == 'function' ? message() : message, ...optionalParams, this.context)
    }
    if (this.isFileLoggingEnabled('log')) {
      this.dump(message, 'INFO', undefined, ...optionalParams)
    }
  }

  /**
   * Log a WARN level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if WARN level is enabled
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  warn(messageSupplier: MessageSupplier, ...optionalParams: any[]): void
  /**
   * Log a WARN level message
   *
   * @param {string} message the message to be logged
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  warn(message: string, ...optionalParams: any[]): void
  warn(message: any, ...optionalParams: any[]): void {
    if (this.isConsoleLoggingEnabled('warn')) {
      super.warn(typeof message == 'function' ? message() : message, ...optionalParams, this.context)
    }
    if (this.isFileLoggingEnabled('warn')) {
      this.dump(message, 'WARN', undefined, ...optionalParams)
    }
  }

  /**
   * Log an ERROR level message with deferred evaluation
   *
   * @param {MessageSupplier} messageSupplier the message supplier function to be evaluated if ERROR level is enabled
   * @param {string} [stack] optional stack trace
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  error(messageSupplier: MessageSupplier, stack?: string, ...optionalParams: any[]): void
  /**
   * Log an ERROR level message
   *
   * @param {*} message the message to be logged
   * @param {string} [stack] optional stack trace
   * @param {...any[]} optionalParams optional parameters to include (each param will print to its own line)
   * @memberof LoggerService
   */
  error(message: string, stack?: string, ...optionalParams: any[]): void
  error(message: any, stack?: string, ...optionalParams: any[]): void {
    if (this.isConsoleLoggingEnabled('error')) {
      const printMessage = typeof message == 'function' ? message() : message
      if (this.isStackLike(stack)) {
        // NestJS's positional arguments are a bit weird, so we have to do some
        // extra work to ensure the stack trace is printed as such... If stack
        // and optional params are passed in the wrong order, we will get odd
        // printing behavior (like the stack trace being printed as a
        // stringified object, or a non-stack item being printed naked to the
        // console as would be expected with a stack trace)
        //
        // Explicitly pass context as with the other methods, but ensure
        // argument[1] is treated as the stack trace if it is stack-like, and
        // explicitly set as the next-to-last param as expected by the super
        // call. Optional params in arguments[2...] are then passed as expected.
        super.error(printMessage, ...optionalParams, stack, this.context)
      } else {
        // If the 1st argument is not stack-like, we can treat it like any other
        // param and pass it before the next-to-last param explicitly as
        // undefined so the super call sees it as such and will not print it.
        // Optional params are then passed as expected, as is explicit context.
        super.error(printMessage, stack, ...optionalParams, undefined, this.context)
      }
    }

    // The file logging API is a bit more sensical
    if (this.isFileLoggingEnabled('error')) {
      if (this.isStackLike(stack)) {
        this.dump(message, 'ERROR', stack, ...optionalParams)
      } else {
        this.dump(message, 'ERROR', undefined, stack, ...optionalParams)
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
  private dump(message: any, level: string, stack?: string, ...optionalParams: any[]) {
    this.writer.write(
      JSON.stringify({
        date: new Date().toISOString(),
        context: this.context,
        level,
        message: typeof message == 'function' ? message() : message,
        // Ensure stack, if null, is undefined so it is not serialized
        stack: stack == 'string' ? stack.split('\n').map(s => s.trim()) : undefined,
        params: optionalParams?.length ? optionalParams : undefined,
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
