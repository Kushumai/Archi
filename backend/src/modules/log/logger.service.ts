import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class LoggerService {
  private logger;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    const logLevel = process.env.LOG_LEVEL || (environment === 'development' ? 'debug' : 'info');

    this.logger = createLogger({
      level: logLevel,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${environment}] ${info.timestamp} [${info.level}] ${info.message}`)
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
