import { transports } from 'winston';

export function getLoggerOptions() {
  return {
    transports: [new transports.Console()],
  };
}
