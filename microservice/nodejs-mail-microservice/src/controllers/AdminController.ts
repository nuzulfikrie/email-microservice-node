import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { AdminService } from '../services/AdminService';

export class AdminTemplateController implements BaseController {
  constructor(private adminService: AdminService) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { action } = req.params;
      const adminId = req.user?.id; // Set by auth middleware

      switch (action) {
        case 'audit':
          const logs = await this.adminService.getAuditLogs();
          res.json(logs);
          break;
        case 'stats':
          const stats = await this.adminService.getMailStats();
          res.json(stats);
          break;
        default:
          res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      next(error);
    }
  }
} 