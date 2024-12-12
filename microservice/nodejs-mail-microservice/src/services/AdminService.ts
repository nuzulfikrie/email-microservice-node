import { getRepository } from 'typeorm';
import { AuditLog } from '../models/AuditLog';
import { MailLog } from '../models/MailLog';
import { LoggingService } from './LoggingService';

export class AdminService {
  private auditLogRepository = getRepository(AuditLog);
  private mailLogRepository = getRepository(MailLog);
  private logger: LoggingService;

  constructor() {
    this.logger = new LoggingService();
  }

  async logAction(adminId: string, action: string, details: string): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      adminId,
      action,
      details,
    });
    await this.auditLogRepository.save(auditLog);
    this.logger.info(`Admin action: ${action} by ${adminId}`);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      order: { actionTime: 'DESC' },
      relations: ['admin'],
    });
  }

  async getMailStats(): Promise<any> {
    const totalMails = await this.mailLogRepository.count();
    const failedMails = await this.mailLogRepository.count({ where: { status: 'ERROR' } });
    const successMails = await this.mailLogRepository.count({ where: { status: 'SENT' } });

    return {
      total: totalMails,
      failed: failedMails,
      success: successMails,
      successRate: (successMails / totalMails) * 100,
    };
  }
} 