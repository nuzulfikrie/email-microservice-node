import { Router } from 'express';
import { MailService } from '../services/MailService';
import { SchedulingService } from '../services/SchedulingService';
import { SendMailController } from '../controllers/MailController';

const router = Router();
const mailService = new MailService();
const schedulingService = new SchedulingService();
const sendMailController = new SendMailController(mailService);

router.post('/send', (req, res, next) => sendMailController.execute(req, res, next));

router.post('/schedule', async (req, res, next) => {
  try {
    const { userId, templateId, data, sendDate } = req.body;
    const scheduled = await schedulingService.scheduleEmail(
      userId,
      templateId,
      data,
      new Date(sendDate)
    );
    res.status(201).json(scheduled);
  } catch (error) {
    next(error);
  }
});

router.get('/scheduled/:userId', async (req, res, next) => {
  try {
    const scheduled = await schedulingService.getScheduledEmails(req.params.userId);
    res.json(scheduled);
  } catch (error) {
    next(error);
  }
});

export default router; 