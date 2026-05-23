// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    // --------------------------------
    // 1. โหลดค่าจากไฟล์ .env
    // --------------------------------
    ConfigModule.forRoot({
      isGlobal: true, // ใช้ได้ทุกที่โดยไม่ต้อง import ซ้ำ
    }),

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
    entities: [User],
    synchronize: false, // dev = true, prod = false
  }),
  inject: [ConfigService],
}),

    // --------------------------------
    // 3. เพิ่ม UsersModule
    // --------------------------------
    UsersModule,
  ],
})
export class AppModule {}