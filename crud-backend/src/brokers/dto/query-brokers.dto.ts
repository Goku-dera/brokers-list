// src/brokers/dto/query-brokers.dto.ts

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import type { BrokerType } from '../entities/broker.entity';

export class QueryBrokersDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(['cfd', 'bond', 'stock', 'crypto'])
  type?: BrokerType;
}
