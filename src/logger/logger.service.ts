
import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common'
import { LoggerConfig } from './logger.config'
import { LogWriterService } from './log-writer.service'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {

  /**
   * Logger service. Logs LOGGING_LEVEL to stdout, but only
   * logs error and warn log events to LOG_FILE
   *
   * @param {string} [context]
   * @memberof LoggerService
   */
  constructor(private readonly config: LoggerConfig, private readonly writer: LogWriterService) {
    super()
  }

  verbose(message: any, context?: string) {
    if (this.isFileLoggingEnabled('verbose'))
      this.dump(message, 'VERB', context)
    if (this.config.stdout.enabled)
      super.verbose.call(this, ...arguments)
  }

  debug(message: any, context?: string) {
    if (this.isFileLoggingEnabled('debug'))
      this.dump(message, 'DEBUG', context)
    if (this.config.stdout.enabled)
      super.debug.call(this, ...arguments)
  }

  log(message: any, context?: string) {
    if (this.isFileLoggingEnabled('log'))
      this.dump(message, 'INFO', context)
    if (this.config.stdout.enabled)
      super.log.call(this, ...arguments)
  }

  warn(message: any, context?: string) {
    if (this.isFileLoggingEnabled('warn'))
      this.dump(message, 'WARN', context)
    if (this.config.stdout.enabled)
      super.warn.call(this, ...arguments)
  }

  error(message: any, stack?: string, context?: string) {
    if (this.isFileLoggingEnabled('error'))
      this.dump(message, 'ERROR', context, stack)
    if (this.config.stdout.enabled)
      super.error.call(this, ...arguments)
  }

  /**
   * Dumps a logging entry to disk
   *
   * @param {*} message
   * @param {string} [stack]
   * @memberof LoggerService
   */
  async dump(message: any, level: string, context?: string, stack?: string) {
    this.writer.write(
      JSON.stringify({
        date: new Date().toISOString(),
        context: context ?? this.context,
        level,
        message,
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
    return this.config.stdout.enabled
      && this.config.file.level.includes(level)
  }
}
