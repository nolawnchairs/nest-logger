// Generated by dts-bundle-generator v5.9.0

import { ConsoleLogger, DynamicModule, LogLevel } from '@nestjs/common';

declare class LogWriterService {
	private readonly config;
	private readonly writeStream;
	constructor(config: LoggerConfig);
	/**
	 * Write to the logging file
	 *
	 * @param {string} value
	 * @memberof LogWriterService
	 */
	write(value: string): void;
}
export declare class LoggerConfig {
	readonly defaltContext: string;
	readonly file: ILoggingProfile & IFileLoggingOptions;
	readonly stdout: ILoggingProfile;
	constructor(config: ILoggerConfig);
	private parseLevel;
}
export declare class LoggerModule {
	/**
	 * Setup logging for the application
	 *
	 * @static
	 * @param {ILoggerConfig} config
	 * @return {*}  {DynamicModule}
	 * @memberof LoggerModule
	 */
	static forRoot(config: ILoggerConfig): DynamicModule;
}
export declare class LoggerService extends ConsoleLogger {
	private readonly config;
	private readonly writer;
	/**
	 * Logger service. Logs LOGGING_LEVEL to stdout, but only
	 * logs error and warn log events to LOG_FILE
	 *
	 * @param {string} [context]
	 * @memberof LoggerService
	 */
	constructor(config: LoggerConfig, writer: LogWriterService);
	verbose(message: any, context?: string): void;
	debug(message: any, context?: string): void;
	log(message: any, context?: string): void;
	warn(message: any, context?: string): void;
	error(message: any, stack?: string, context?: string): void;
	/**
	 * Dumps a logging entry to disk
	 *
	 * @param {*} message
	 * @param {string} [stack]
	 * @memberof LoggerService
	 */
	dump(message: any, level: string, context?: string, stack?: string): Promise<void>;
	/**
	 * Determine if file logging is enabled for a given level
	 *
	 * @private
	 * @param {LogLevel} level
	 * @memberof LoggerService
	 */
	private isFileLoggingEnabled;
}
export declare const NEST_LOGGER = "NEST_LOGGER";
export declare function Logger(context: string): (target: object, key: string | symbol, index?: number) => void;
export declare type IFileLoggingOptions = {
	filename: string;
};
export interface ILoggerConfig {
	defaultContext?: string;
	profiles: {
		file: ILoggingProfileOptions & IFileLoggingOptions;
		stdout: ILoggingProfileOptions;
	};
}
export interface ILoggingProfile {
	level: LogLevel[];
	enabled: boolean;
	eol: string;
}
export interface ILoggingProfileOptions {
	level: LogLevel[] | string;
	enabled?: boolean;
	eol?: string;
}

export as namespace MyModuleName;

export {};