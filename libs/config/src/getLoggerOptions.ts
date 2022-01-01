import { LoggerOptions, transports } from 'winston';

export function getLoggerOptions(): LoggerOptions {
  return {
    transports: [new transports.Console()],
    silent: process.env.NODE_ENV === 'test',
  };
}
