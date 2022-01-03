import { LoggerOptions, transports } from 'winston';

export function getLoggerOptions(): LoggerOptions {
  const nodeEnv = process.env.NODE_ENV;

  const isLocalEnv = ['local', 'test', undefined].includes(nodeEnv);
  const level = isLocalEnv ? 'debug' : 'info';

  console.log(`nodeEnv=${nodeEnv}, level=${level}`);

  return {
    transports: [new transports.Console()],
    silent: process.env.NODE_ENV === 'test',
  };
}
