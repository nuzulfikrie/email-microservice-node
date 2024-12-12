import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { MailTemplate } from './MailTemplate';

@Entity()
export class TemplateVersion {
  @PrimaryGeneratedColumn('uuid')
  versionId: string;

  @ManyToOne(() => MailTemplate, template => template.versions)
  template: MailTemplate;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdDate: Date;
} 