
import { createWriteStream, WriteStream } from 'fs'
import { Inject, Injectable } from '@nestjs/common'
import { LoggerConfig, NEST_LOGGER_CONFIG } from './logger.config'

@Injectable()
export class LogWriterService {

  private readonly writeStream: WriteStream

  constructor(
    @Inject(NEST_LOGGER_CONFIG) private readonly config: LoggerConfig) {
    const { enabled, filename, mode, encoding } = config.file
    if (enabled) {
      this.writeStream = createWriteStream(filename, {
        mode,
        encoding,
        flags: 'a',
      })
    }
  }

  /**
   * Write to the logging file
   *
   * @param {string} value
   * @memberof LogWriterService
   */
  write(value: string) {
    if (this.config.file.enabled) {
      this.writeStream.write(
        value, () => void 0,
      )
    }
  }
}
