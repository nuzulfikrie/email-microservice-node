import Queue from 'bull';
import { MailService } from './MailService';

interface EmailJob {
  userId: string;
  templateId: string;
  data: any;
  scheduledFor?: Date;
}

export class QueueService {
  private emailQueue: Queue.Queue;
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService();
    this.emailQueue = new Queue('email-queue', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.processJobs();
  }

  private processJobs(): void {
    this.emailQueue.process(async (job) => {
      const { userId, templateId, data } = job.data;
      return await this.mailService.sendMail(userId, templateId, data);
    });

    this.emailQueue.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.emailQueue.on('failed', (job, error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });
  }

  async addToQueue(job: EmailJob): Promise<Queue.Job> {
    const options: Queue.JobOptions = {};
    
    if (job.scheduledFor) {
      options.delay = job.scheduledFor.getTime() - Date.now();
    }

    return await this.emailQueue.add(job, options);
  }

  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.emailQueue.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress(),
      data: job.data,
    };
  }
} 