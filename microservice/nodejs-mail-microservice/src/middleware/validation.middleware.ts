import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoggingService } from '../services/LoggingService';

const logger = new LoggingService();

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      logger.warn('Validation failed:', errors);
      res.status(400).json({
        status: 'error',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }

    req.body = dtoObject;
    next();
  };
} 