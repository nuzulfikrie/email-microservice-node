import { getRepository } from 'typeorm';
import { ScheduledMail } from '../models/ScheduledMail';
import { QueueService } from './QueueService';

export class SchedulingService {
  private scheduledMailRepository = getRepository(ScheduledMail);
  private queueService: QueueService;

  constructor() {
    this.queueService = new QueueService();
  }

  async scheduleEmail(userId: string, templateId: string, data: any, sendDate: Date): Promise<ScheduledMail> {
    const scheduledMail = this.scheduledMailRepository.create({
      userId,
      templateId,
      sendDate,
      isSent: false,
    });

    await this.scheduledMailRepository.save(scheduledMail);

    await this.queueService.addToQueue({
      userId,
      templateId,
      data,
      scheduledFor: sendDate,
    });

    return scheduledMail;
  }

  async cancelScheduledEmail(scheduleId: string): Promise<void> {
    const scheduledMail = await this.scheduledMailRepository.findOne(scheduleId);
    if (!scheduledMail) {
      throw new Error('Scheduled mail not found');
    }

    if (scheduledMail.isSent) {
      throw new Error('Email has already been sent');
    }

    await this.scheduledMailRepository.remove(scheduledMail);
  }

  async getScheduledEmails(userId: string): Promise<ScheduledMail[]> {
    return await this.scheduledMailRepository.find({
      where: { userId, isSent: false },
      relations: ['template'],
    });
  }
} 