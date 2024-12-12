import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './User';
import { MailTemplate } from './MailTemplate';
import { Attachment } from './Attachment';

@Entity()
export class MailLog {
  @PrimaryGeneratedColumn('uuid')
  mailId: string;

  @ManyToOne(() => User, user => user.mailLogs)
  user: User;

  @ManyToOne(() => MailTemplate)
  template: MailTemplate;

  @Column()
  status: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ nullable: true })
  errorDetails: string;

  @OneToMany(() => Attachment, attachment => attachment.mailLog)
  attachments: Attachment[];
} 