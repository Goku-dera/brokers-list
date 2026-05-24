// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { BrokersModule } from './brokers/brokers.module';
import { Broker } from './brokers/entities/broker.entity';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // --------------------------------
    // 1. โหลดค่าจากไฟล์ .env
    // --------------------------------
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    RedisModule,

    // --------------------------------
    // 2. เชื่อมต่อ Database
    // --------------------------------
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, Broker],
    synchronize: false, // dev = true, prod = false
  }),
  inject: [ConfigService],
}),

    // --------------------------------
    // 3. เพิ่ม UsersModule
    // --------------------------------
    UsersModule,
    AuthModule,
    BrokersModule,
  ],
})
export class AppModule {}