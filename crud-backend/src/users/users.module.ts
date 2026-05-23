// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
    // บอกว่า Module นี้ใช้ Table User
    // TypeORM จะเตรียม Repository ของ User ให้
  ],
  providers: [UsersService],
  // providers = Service ต่างๆ ที่ Module นี้มี
  
  exports: [UsersService],
  controllers: [UsersController],
  // exports = อนุญาตให้ Module อื่น ใช้ UsersService ได้
})
export class UsersModule {}