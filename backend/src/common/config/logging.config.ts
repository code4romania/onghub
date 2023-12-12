import * as dotenv from 'dotenv';
import { Params as PinoLoggerParams } from 'nestjs-pino';
dotenv.config();

// Possible loggin levels, from quiet to verbose
export type LOGGING_LEVEL =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace';

export const PinoLoggerConfig: PinoLoggerParams = {
  pinoHttp: {
    level: process.env.LOGGING_LEVEL || 'trace',
    autoLogging: {
      ignore: (req) => {
        return req.url.includes('health');
      },
    },
  },
};
