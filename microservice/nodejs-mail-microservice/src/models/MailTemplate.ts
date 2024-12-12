import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { TemplateVersion } from './TemplateVersion';

@Entity()
export class MailTemplate {
  @PrimaryGeneratedColumn('uuid')
  templateId: string;

  @Column()
  templateName: string;

  @Column()
  subject: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TemplateVersion, version => version.template)
  versions: TemplateVersion[];
} 