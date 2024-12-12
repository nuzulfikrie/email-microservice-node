import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import { EmailSubscription } from './EmailSubscription';
import { MailLog } from './MailLog';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  userName: string;

  @OneToMany(() => EmailSubscription, subscription => subscription.user)
  subscriptions: EmailSubscription[];

  @OneToMany(() => MailLog, mailLog => mailLog.user)
  mailLogs: MailLog[];
} 