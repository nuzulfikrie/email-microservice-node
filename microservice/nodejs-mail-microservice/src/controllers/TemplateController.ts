import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/TemplateService';
import { BaseController } from './BaseController';

export class CreateTemplateController implements BaseController {
  constructor(private templateService: TemplateService) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateName, subject, content } = req.body;
      const template = await this.templateService.createTemplate(templateName, subject, content);
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  }
}

export class UpdateTemplateController implements BaseController {
  constructor(private templateService: TemplateService) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const { content } = req.body;
      const version = await this.templateService.updateTemplate(templateId, content);
      res.json(version);
    } catch (error) {
      next(error);
    }
  }
}

export class GetTemplateController implements BaseController {
  constructor(private templateService: TemplateService) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const template = await this.templateService.getTemplate(templateId);
      res.json(template);
    } catch (error) {
      next(error);
    }
  }
} 