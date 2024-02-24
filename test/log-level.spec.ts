
// Setup the test environment
// Bring in a simple NestJS module and run against tests

import { Test, TestingModule } from '@nestjs/testing'
import { ILoggerConfig, NEST_LOGGER } from '../src/logger/logger.config'
import { LoggerModule } from '../src/logger/logger.module'
import { LoggerService } from '../src/logger/logger.service'

const LOGGER_CONFIG: ILoggerConfig = {
  defaultContext: 'Main',
  profiles: {
    file: {
      enabled: false,
      filename: 'test.log',
    },
    stdout: {
      enabled: false, // We don't want to see the output in the console during testing
      level: 'DIWE', // Disable verbose logging to test whether the log level is working
    },
  },
}

describe('LoggerService', () => {
  let service: LoggerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot(LOGGER_CONFIG),
      ],
    }).compile()

    service = module.get<LoggerService>(NEST_LOGGER)
    module.useLogger(service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should log a message', () => {
    const message = 'Hello World'
    const spy = jest.spyOn(service, 'log')
    service.log(message)
    expect(spy).toHaveBeenCalledWith(message)
  })

  it('should log a message with context', () => {
    const message = 'Hello World'
    const context = 'Test'
    const spy = jest.spyOn(service, 'log')
    service.log(message, context)
    expect(spy).toHaveBeenCalledWith(message, context)
  })

  it('should log debug messages', () => {
    const message = 'Hello World'
    const spy = jest.spyOn(service, 'debug')
    service.debug(message)
    expect(spy).toHaveBeenCalledWith(message)
  })

  it('should log debug messages with context', () => {
    const message = 'Hello World'
    const context = 'Test'
    const spy = jest.spyOn(service, 'debug')
    service.debug(message, context)
    expect(spy).toHaveBeenCalledWith(message, context)
  })

  it('should log warning messages', () => {
    const message = 'Hello World'
    const spy = jest.spyOn(service, 'warn')
    service.warn(message)
    expect(spy).toHaveBeenCalledWith(message)
  })

  it('should log warning messages with context', () => {
    const message = 'Hello World'
    const context = 'Test'
    const spy = jest.spyOn(service, 'warn')
    service.warn(message, context)
    expect(spy).toHaveBeenCalledWith(message, context)
  })

  it('should log error messages', () => {
    const message = 'Hello World'
    const spy = jest.spyOn(service, 'error')
    service.error(message)
    expect(spy).toHaveBeenCalledWith(message)
  })

  it('should log error messages with context', () => {
    const message = 'Hello World'
    const context = 'Test'
    const spy = jest.spyOn(service, 'error')
    service.error(message, context)
    expect(spy).toHaveBeenCalledWith(message, context)
  })

  it('should log error messages with context and stack', () => {
    const message = 'Hello World'
    const context = 'Test'
    const stack = 'Stack'
    const spy = jest.spyOn(service, 'error')
    service.error(message, stack, context)
    expect(spy).toHaveBeenCalledWith(message, stack, context)
  })

  it('shold log verbose messages', () => {
    const message = 'Hello World'
    const spy = jest.spyOn(service, 'verbose')
    service.verbose(message)
    expect(spy).toHaveBeenCalledWith(message)
  })
})
