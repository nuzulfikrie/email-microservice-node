import { getRepository } from 'typeorm';
import nodemailer from 'nodemailer';
import { MailTemplate } from '../models/MailTemplate';
import { MailLog } from '../models/MailLog';
import { User } from '../models/User';
import { BlacklistService } from './BlacklistService';

export class MailService {
  private blacklistService: BlacklistService;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.blacklistService = new BlacklistService();
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(userId: string, templateId: string, data: any) {
    const userRepo = getRepository(User);
    const templateRepo = getRepository(MailTemplate);
    const mailLogRepo = getRepository(MailLog);

    try {
      const user = await userRepo.findOne(userId);
      if (!user) throw new Error('User not found');

      // Check blacklist
      const isBlacklisted = await this.blacklistService.isBlacklisted(user.email);
      if (isBlacklisted) throw new Error('Email is blacklisted');

      const template = await templateRepo.findOne(templateId, {
        relations: ['versions'],
      });
      if (!template) throw new Error('Template not found');

      // Get latest version
      const latestVersion = template.versions[template.versions.length - 1];

      // Process template with data
      const processedContent = this.processTemplate(latestVersion.content, data);

      // Send email
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: template.subject,
        html: processedContent,
      });

      // Log success
      const mailLog = mailLogRepo.create({
        userId,
        templateId,
        status: 'SENT',
        sentAt: new Date(),
      });
      await mailLogRepo.save(mailLog);

      return mailLog;
    } catch (error) {
      // Log error
      const mailLog = mailLogRepo.create({
        userId,
        templateId,
        status: 'ERROR',
        errorDetails: error.message,
        sentAt: new Date(),
      });
      await mailLogRepo.save(mailLog);

      throw error;
    }
  }

  private processTemplate(content: string, data: any): string {
    // Simple template processing - could be enhanced with a proper template engine
    let processed = content;
    Object.entries(data).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return processed;
  }
} 