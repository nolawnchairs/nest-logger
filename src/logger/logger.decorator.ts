
import { Inject } from '@nestjs/common'
import { addLoggingContext } from './logger.provider'
import { NEST_LOGGER_PREFIX } from './logger.config'

export function Logger(context: string) {
  addLoggingContext(context)
  return Inject(`${NEST_LOGGER_PREFIX}.${context}`)
}
