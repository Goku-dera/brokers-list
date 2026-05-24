// src/brokers/dto/create-broker.dto.ts

import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEnum,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

const emptyToUndefined = ({ value }: { value: unknown }) =>
  value === '' || value === null ? undefined : value;

export class CreateBrokerDto {
  @IsString()
  @IsNotEmpty({ message: 'Broker name is required' })
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @ValidateIf((_, value) => value !== undefined)
  @IsUrl({}, { message: 'Logo URL must be a valid URL' })
  logo_url?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @ValidateIf((_, value) => value !== undefined)
  @IsUrl({}, { message: 'Website must be a valid URL' })
  website?: string;

  @IsEnum(['cfd', 'bond', 'stock', 'crypto'], {
    message: 'Broker type must be one of: cfd, bond, stock, crypto',
  })
  broker_type!: 'cfd' | 'bond' | 'stock' | 'crypto';
}