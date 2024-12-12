import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { MailLog } from './MailLog';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  attachmentId: string;

  @ManyToOne(() => MailLog, mailLog => mailLog.attachments)
  mailLog: MailLog;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  size: number;

  @Column()
  storagePath: string;
} 