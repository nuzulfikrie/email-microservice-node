import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../services/LoggingService';

const logger = new LoggingService();

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    logger.error(`Operational error: ${error.message}`);
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  logger.error('Unexpected error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}; 