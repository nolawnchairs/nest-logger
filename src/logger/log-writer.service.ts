
import { createWriteStream, WriteStream } from 'fs'
import { Injectable } from '@nestjs/common'
import { LoggerConfig } from './logger.config'

@Injectable()
export class LogWriterService {

  private readonly writeStream: WriteStream

  constructor(private readonly config: LoggerConfig) {
    if (config.file.enabled) {
      this.writeStream = createWriteStream(config.file.filename, {
        mode: 0o644,
        encoding: 'utf-8',
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
