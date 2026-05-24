// src/brokers/brokers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokersService } from './brokers.service';
import { BrokersController } from './brokers.controller';
import { Broker } from './entities/broker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Broker])], // ✅ Register Entity
  controllers: [BrokersController],
  providers: [BrokersService],
})
export class BrokersModule {}