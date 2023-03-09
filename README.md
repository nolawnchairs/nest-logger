
# NestJS Logger

This is an in-house tool for extending the NestJS logger to include file logging.

Not supported for general use.

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

## Performance enhancements using deferred message evaluation

Typically, messages are logged by passing a string into one of the logging
methods. This is fine for simple messages, but can be slow for more complex
messages. For example, if you want to log an object, you would need to stringify
it first:

```ts
this.logger.log('This is a logging message')
this.logger.log(JSON.stringify({ foo: 'bar' }))
```

Or there may be the need to use a string template to format the message, which
may include more complex calls such as array joins or other string manipulation:

```ts
this.logger.log(`The value of foo is ${foo}`)
this.logger.log(`The values of foo are ${foo.join(', ')}`)
this.logger.log(`This thing happened at ${date.toISOString()}`)
```

While this is fine for most cases, it can be slow for more complex messages.
There will almost certainly be occasions where you want to log a complex object
with the more fine-grained development levels such as `debug` or `verbose`, so
your can see and track output in development. The issue is, these complex
evaluations will always be performed, regardless of whether in development or
production.

To address this, this library allows you to pass a function into the logging
methods. This function will only be executed if the logging level is enabled.
For example:

```ts
this.logger.log(() => JSON.stringify(complicatedObject))
```

This ensures that only messages that we're interested in will be evaluated. This
can be a significant performance improvement for more complex messages,
especially when using `debug` or `verbose` inside loops and busy code. If in
production, the message will not be evaluated at all, eliminating the
performance penalty.

```ts
// This object witll be stringified even if the log level is disabled
this.logger.verbose(JSON.stringify(complicatedObject))

// This object will only be stringified if the log level is enabled, 
// as the function argument will be deferred
this.logger.verbose(() => JSON.stringify(complicatedObject))
```

These overloads to NestJS's `LoggerService` do not conflict with the standard
string-based overloads, so you can use them interchangeably, and is completely
opt-in.

## Caveats

The logging methods in the default implementation of NestJS's `ConsoleLogger`
all have a `context` argument used to override the logging context (in our case
the name of the logger instance). Since we enforce a valid context to be
provided via the `@Logger` decorator, the context passed in via the `context`
argument is ignored in console and file logging and will always reflect the name
provided to the logger instance. 

This argument is still included in our method signatures to maintain
compatibility with NestJS's `LoggerService` interface.

This was done because not only should the context be static, but passing it to
the parent `ConsoleLogger` instance causes a second log event to be emitted,
with the value of `undefined`. This has something to do with the way NestJS
handles the `context` argument, and is not something we can control, so it was
best to just disable its use.
