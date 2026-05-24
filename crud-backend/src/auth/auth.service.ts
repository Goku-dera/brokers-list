// src/auth/auth.service.ts

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --------------------------------
  // Register + Return JWT Token
  // --------------------------------
  async register(fullName: string, email: string, password: string) {
    
    // 1. เช็คว่า Email ซ้ำไหม
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 10 = salt rounds (ยิ่งมาก ยิ่งปลอดภัย แต่ช้ากว่า)

    // 3. บันทึก User ลง DB
    const user = await this.usersService.create({
      fullName,
      email,
      password: hashedPassword, // เก็บ hashed password
    });

    // 4. Generate JWT Token
    const payload = {
      sub: user.id,    // sub = subject (มาตรฐาน JWT)
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    // 5. Return token + user info (ไม่ส่ง password กลับ)
    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }


    // --------------------------------
  // ✅ Login + Return JWT Token
  // --------------------------------
  async login(email: string, password: string) {
    // 1. หา User จาก Email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. เช็ค Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate JWT Token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // 4. Return token + user info
    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}