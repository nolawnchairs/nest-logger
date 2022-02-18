
import { DynamicModule, Module } from '@nestjs/common'
import { createConfigProvider, createLoggerProvider, createLoggerProviders, createWriterProvider } from './logger.provider'
import { LoggerService } from './logger.service'
import { ILoggerConfig } from './logger.config'

@Module({})
export class LoggerModule {

  /**
   * Setup logging for the application
   *
   * @static
   * @param {ILoggerConfig} config
   * @return {*}  {DynamicModule}
   * @memberof LoggerModule
   */
  static forRoot(config: ILoggerConfig): DynamicModule {
    const providers = createLoggerProviders()
    return {
      global: true,
      module: LoggerModule,
      providers: [
        LoggerService,
        createWriterProvider(),
        createLoggerProvider(),
        createConfigProvider(config),
        ...providers,
      ],
      exports: [
        LoggerService,
        ...providers,
      ],
    }
  }
}
