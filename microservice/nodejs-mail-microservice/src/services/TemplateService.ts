import { getRepository } from 'typeorm';
import { MailTemplate } from '../models/MailTemplate';
import { TemplateVersion } from '../models/TemplateVersion';

export class TemplateService {
  private templateRepository = getRepository(MailTemplate);
  private versionRepository = getRepository(TemplateVersion);

  async createTemplate(templateName: string, subject: string, content: string): Promise<MailTemplate> {
    const template = this.templateRepository.create({
      templateName,
      subject,
      isActive: true
    });

    await this.templateRepository.save(template);

    const version = this.versionRepository.create({
      template,
      content
    });

    await this.versionRepository.save(version);

    template.versions = [version];
    return template;
  }

  async updateTemplate(templateId: string, content: string): Promise<TemplateVersion> {
    const template = await this.templateRepository.findOne(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const version = this.versionRepository.create({
      template,
      content
    });

    return await this.versionRepository.save(version);
  }

  async getTemplate(templateId: string): Promise<MailTemplate> {
    const template = await this.templateRepository.findOne(templateId, {
      relations: ['versions']
    });
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async getAllTemplates(): Promise<MailTemplate[]> {
    return await this.templateRepository.find({
      where: { isActive: true },
      relations: ['versions']
    });
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const template = await this.templateRepository.findOne(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    template.isActive = false;
    await this.templateRepository.save(template);
  }
} 