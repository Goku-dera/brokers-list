// src/brokers/entities/broker.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type BrokerType = 'cfd' | 'bond' | 'stock' | 'crypto';

@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  logo_url!: string;

  @Column({ nullable: true })
  website!: string;

  @Column({
    type: 'enum',
    enum: ['cfd', 'bond', 'stock', 'crypto'],
  })
  broker_type!: BrokerType;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}