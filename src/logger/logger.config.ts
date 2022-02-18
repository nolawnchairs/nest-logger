
import { LogLevel } from '@nestjs/common'

export const NEST_LOGGER = 'NEST_LOGGER'
export const NEST_LOGGER_PREFIX = 'NEST_LOGGER'
export const NEST_LOGGER_WRITER = 'NEST_LOGGER_WRITER'
export const NEST_LOGGER_CONFIG = 'NEST_LOGGER_CONFIG'
export const DEFAULT_CONTEXT = 'Main'

export interface ILoggerConfig {
  defaultContext?: string
  profiles: {
    file: ILoggingProfileOptions & IFileLoggingOptions
    stdout: ILoggingProfileOptions
  }
}

export interface ILoggingProfileOptions {
  level: LogLevel[] | string
  enabled?: boolean
  eol?: string
}

export type IFileLoggingOptions = {
  filename: string
  mode?: number
  encoding?: BufferEncoding
}

export interface ILoggingProfile {
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
  readonly defaltContext: string
  readonly file: ILoggingProfile & IFileLoggingOptions
  readonly stdout: ILoggingProfile

  constructor(config: ILoggerConfig) {
    const { profiles } = config
    this.defaltContext = config.defaultContext ?? DEFAULT_CONTEXT
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
