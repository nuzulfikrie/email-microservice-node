import { Router } from 'express';
import { AdminService } from '../services/AdminService';
import { AdminTemplateController } from '../controllers/AdminController';
import { adminAuthMiddleware } from '../middleware/auth.middleware';
import { validateDto } from '../middleware/validation.middleware';

const router = Router();
const adminService = new AdminService();
const adminController = new AdminTemplateController(adminService);

// Apply admin authentication to all routes
router.use(adminAuthMiddleware);

router.get('/audit', (req, res, next) => adminController.execute(req, res, next));
router.get('/stats', (req, res, next) => adminController.execute(req, res, next));

router.post('/blacklist', validateDto(BlacklistDto), async (req, res, next) => {
  try {
    const { email, reason } = req.body;
    const result = await adminService.addToBlacklist(email, reason);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 