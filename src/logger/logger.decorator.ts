
import { Inject } from '@nestjs/common'
import { addLoggingContext } from './logger.provider'
import { NEST_LOGGER_PREFIX } from './logger.config'

/**
 * Decorator to inject a new instance of the LoggerService
 *
 * @export
 * @param {(string | Function)} contextOrClass - The context to use for the logger as a string or a class constructor, from which the name will be derived.
 */
export function Logger(contextOrClass: string | Function): ParameterDecorator {
  const context = typeof contextOrClass == 'string' ? contextOrClass : contextOrClass.name
  addLoggingContext(context)
  return Inject(`${NEST_LOGGER_PREFIX}.${context}`)
}
