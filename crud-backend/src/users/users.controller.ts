import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
;

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

// users.controller.ts
@Post('register')
@HttpCode(HttpStatus.CREATED)
async register(@Body() createUserDto: CreateUserDto) {
  const user = await this.usersService.create({
    fullName: createUserDto.fullName, 
    email: createUserDto.email,
    password: createUserDto.password,
  });

  return {
    statusCode: 201,
    message: 'User registered successfully',
    data: user,
  };
}


@Get('test')
@HttpCode(HttpStatus.CREATED)
async test() {
 
return this.usersService.findByEmail("abc@gmail.com");
}
}