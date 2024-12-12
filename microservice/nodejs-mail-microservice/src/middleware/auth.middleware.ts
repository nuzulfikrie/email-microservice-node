import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Admin } from '../models/Admin';
import { LoggingService } from '../services/LoggingService';

const logger = new LoggingService();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const adminAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== 'admin') {
        logger.warn(`Unauthorized admin access attempt by user ${req.user?.id}`);
        res.status(403).json({ error: 'Admin access required' });
        return;
      }
      next();
    });
  } catch (error) {
    next(error);
  }
}; 