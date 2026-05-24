import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto'; // ✅ เพิ่ม

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(
      createUserDto.fullName,
      createUserDto.email,
      createUserDto.password,
    );

    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: result, // { token, user }
    };
  }

  // ✅ POST /api/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      statusCode: 200,
      message: 'Login successful',
      data: result,
    };
  }
}