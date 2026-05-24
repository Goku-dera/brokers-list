// src/users/users.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // เอาแค่ route test ไว้ก่อน
  @Get('test')
  async test() {
    return 'Hello from UsersController!';
  }
}
