import { Request, Response, NextFunction } from 'express';

export interface BaseController {
  execute(req: Request, res: Response, next: NextFunction): Promise<void>;
} 