
import { Provider } from '@nestjs/common'
import { ILoggerConfig, LoggerConfig, NEST_LOGGER, NEST_LOGGER_PREFIX } from './logger.config'
import { LogWriterService } from './log-writer.service'
import { LoggerService } from './logger.service'

// Store a unique collection of all contexts
const loggerContexts = new Set<string>()

export function addLoggingContext(context: string) {
  loggerContexts.add(context)
}

/**
 * Create providers for each logging context
 *
 * @export
 * @return {*}  {Provider<LoggerService>[]}
 */
export function createLoggerProviders(): Provider<LoggerService>[] {
  return [...loggerContexts].map(context => createLoggerProvider(context))
}

export function createLoggerProvider(context?: string): Provider<LoggerService> {
  return {
    provide: context ? `${NEST_LOGGER_PREFIX}.${context}` : NEST_LOGGER,
    useFactory: (writer: LogWriterService, config: LoggerConfig) => {
      const logger = new LoggerService(config, writer)
      logger.setContext(context ?? config.defaltContext)
      logger.setLogLevels(config.stdout.level)
      return logger
    },
    inject: [
      LogWriterService,
      LoggerConfig,
    ],
  }
}

export function createConfigProvider(config: ILoggerConfig): Provider<LoggerConfig> {
  return {
    provide: LoggerConfig,
    useFactory: () => new LoggerConfig(config),
  }
}

export function createWriterProvider(): Provider<LogWriterService> {
  return {
    provide: LogWriterService,
    useFactory: (config: LoggerConfig) => new LogWriterService(config),
    inject: [
      LoggerConfig,
    ],
  }
}
