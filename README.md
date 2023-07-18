
# NestJS Logger

This is an in-house tool for extending the NestJS logger to include file logging.

Not supported for general use.

## Versions 1.2.x

This attempted to implement deferred evaluation of the log message, but it was so incompatible
with the native NestJS logger that it was abandoned. Ensure your version is >= 1.3

## Usage

### Bootstrap

Add the logger to the Nest bootstrap function

```ts
import { NestFactory } from '@nestjs/core'
import { LoggerService, NEST_LOGGER } from '@nolawnchairs/nest-logger'
import { AppModule } from './app.module'

async function bootstrap() {

  // Buffer logs so Nest bootstrapping log events will be applied to our logger
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  // Get the logger using the NEST_LOGGER token
  const logger = app.get<LoggerService>(NEST_LOGGER)

  // Set the logger instance
  app.useLogger(logger)

  await app.listen(3000)
  logger.log('Application has started')
}
```

### Import to the AppModule

Add the `LoggerModule` to your `AppModule` imports:

```ts
import { LoggerModule } from '@nolawnchairs/nest-logger'

@Module({
  imports: [
    LoggerModule.forRoot({
      // The default context if one is not provided
      defaultContext: 'Main',
      profiles: {
        // File logging
        file: {
          // Full path to the log file
          filename: '/var/log/app.log',
          // Logging level. This prints only errors and warnings
          level: ['warn', 'error'],
        },
        stdout: {
          // Logging Level. This prints ALL log levels
          level: 'VDIWE',
        },
      },
    }),
  ]
})
export class AppModule { }
```

### Configuring Levels

Log levels can be expressed as an array of NestJS `LogLevel` strings:

```
['verbose', 'debug', 'log', 'warn', 'error']
```

Or as our shorthand, with the desired levels as a single string:

```
V: Verbose
D: Debug
I: Info (Log)
W: Warn
E: Error
```

> **Note** that we abbreviate the `log` level as `I` instead of `L`, as we believe the term `log` poorly describes the level.

### Usage with Injection

```ts
import { Injectable } from '@nestjs/common'
import { Logger, LoggerService } from '@nolawnchairs/nest-logger'

@Injectable()
export class AppService {

  constructor(
    @Logger(AppService) private readonly logger: LoggerService) { }

  test() {
    this.logger.log('This is an info-level message')
  }
}

```
## Caveats

The logging methods in the default implementation of NestJS's `ConsoleLogger`
all have a `context` argument used to override the logging context (in our case
the name of the logger instance). With all NestJS logger calls, the LAST argument
provided will override the context if it's a string.