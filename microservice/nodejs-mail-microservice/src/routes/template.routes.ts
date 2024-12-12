import { Router } from 'express';
import { TemplateService } from '../services/TemplateService';
import {
  CreateTemplateController,
  UpdateTemplateController,
  GetTemplateController,
} from '../controllers/TemplateController';

const router = Router();
const templateService = new TemplateService();

const createTemplateController = new CreateTemplateController(templateService);
const updateTemplateController = new UpdateTemplateController(templateService);
const getTemplateController = new GetTemplateController(templateService);

router.post('/', (req, res, next) => createTemplateController.execute(req, res, next));
router.put('/:templateId', (req, res, next) => updateTemplateController.execute(req, res, next));
router.get('/:templateId', (req, res, next) => getTemplateController.execute(req, res, next));
router.get('/', async (req, res, next) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

export default router; 