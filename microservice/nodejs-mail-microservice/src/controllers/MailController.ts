import { Request, Response, NextFunction } from 'express';
import { MailService } from '../services/MailService';
import { BaseController } from './BaseController';

export class SendMailController implements BaseController {
  constructor(private mailService: MailService) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, templateId, data } = req.body;
      const mailLog = await this.mailService.sendMail(userId, templateId, data);
      res.status(202).json(mailLog);
    } catch (error) {
      next(error);
    }
  }
} 