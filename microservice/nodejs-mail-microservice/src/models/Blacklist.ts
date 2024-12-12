import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity()
export class Blacklist {
  @PrimaryGeneratedColumn('uuid')
  blacklistId: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  addedDate: Date;

  @Column({ nullable: true })
  reason: string;
} 