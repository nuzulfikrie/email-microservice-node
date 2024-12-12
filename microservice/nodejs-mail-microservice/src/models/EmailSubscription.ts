import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class EmailSubscription {
  @PrimaryGeneratedColumn('uuid')
  subscriptionId: string;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  subscribedAt: Date;
} 