
import { LogLevel } from '@nestjs/common'

export const NEST_LOGGER = 'NEST_LOGGER'
export const NEST_LOGGER_PREFIX = 'NEST_LOGGER'
export const NEST_LOGGER_WRITER = 'NEST_LOGGER_WRITER'
export const NEST_LOGGER_CONFIG = 'NEST_LOGGER_CONFIG'
export const DEFAULT_CONTEXT = 'Main'

export interface ILoggerConfig {
  /**
   * The default context for the logger, if none is provided via injection. If
   * omitted, no context will be printed.
   *
   * @type {string}
   * @memberof ILoggerConfig
   */
  defaultContext?: string
  profiles: {
    /**
     * The configuration for the file logger
     *
     * @type {(ProfileOptions & FileOptions)}
     */
    file: Partial<FileOptions> & ProfileOptions<boolean>
    /**
     * The configuration for the console logger
     *
     * @type {ProfileOptions}
     */
    stdout: ProfileOptions<boolean>
  }
}

export type ProfileOptions<TEnabled extends boolean> = {
  /**
   * Whether or not to enable this logging profile. Default `true`.
   *
   * @type {boolean}
   * @memberof ILoggingProfileOptions
   */
  enabled?: TEnabled
  /**
   * The log levels to apply to the logger.
   *
   * Can be an array of NestJS log levels, as is normally
   * provided to the native NestJS logger:
   *
   * ```ts
   * ['verbose', 'debug', 'log', 'warn', 'error']
   * ```
   *
   * Or a combined string shorthand:
   *
   * ```
   * VDIWE (verbose, debug, info, warn, error)
   * ```
   * Note that the level for `log` is abbreviated as `I` and not `L`
   *
   * @type {(LogLevel[] | string)}
   * @memberof ILoggingProfileOptions
   */
  level?: TEnabled extends true ? LogLevel[] | string : undefined
  /**
   * The end-of-line character to use when writing logs. Defaluts to `\n`.
   *
   * @type {string}
   * @memberof ILoggingProfileOptions
   */
  eol?: string
}

export type FileOptions = {
  /**
   * The full path to the log file.
   *
   * @type {string}
   */
  filename: string
  /**
   * The file mode for the log file. Defaults to `644`.
   *
   * @type {number}
   */
  mode?: number
  /**
   * The character encoding for the log file. Defaults to `utf8`.
   *
   * @type {BufferEncoding}
   */
  encoding?: BufferEncoding
}

// Resolved profile
export type LoggingProfile = {
  level: LogLevel[]
  enabled: boolean
  eol: string
}

const LEVEL_CODES: Record<string, LogLevel> = {
  V: 'verbose',
  D: 'debug',
  I: 'log',
  W: 'warn',
  E: 'error',
}

export class LoggerConfig {
  readonly defaultContext: string
  readonly file: LoggingProfile & FileOptions
  readonly stdout: LoggingProfile

  constructor(config: ILoggerConfig) {
    const { profiles } = config as ILoggerConfig
    this.defaultContext = config.defaultContext ?? DEFAULT_CONTEXT
    this.file = {
      eol: profiles.file.eol ?? '\n',
      filename: profiles.file.filename,
      mode: profiles.file.mode ?? 0o644,
      encoding: profiles.file.encoding ?? 'utf-8',
      level: typeof profiles.file.level == 'string' ? this.parseLevel(profiles.file.level) : profiles.file.level,
      enabled: profiles.file.enabled ?? true,
    }

    this.stdout = {
      eol: profiles.stdout.eol ?? '\n',
      level: typeof profiles.stdout.level == 'string' ? this.parseLevel(profiles.stdout.level) : profiles.stdout.level,
      enabled: profiles.stdout.enabled ?? true,
    }
  }

  private parseLevel(levelEnv: string): LogLevel[] | null {
    if (!levelEnv)
      return null
    return levelEnv.split('').map(c => LEVEL_CODES[c])
  }
}
