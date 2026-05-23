// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
// Injectable = บอกว่า class นี้สามารถถูก "ฉีด" เข้าไปใช้ใน class อื่นได้

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository = ดึง Repository ของ Entity มาใช้

import { Repository } from 'typeorm';
// Repository = ตัวช่วยทำ CRUD กับ Database

import { User } from './user.entity';
// Import class User ที่เราสร้างไว้

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // userRepository คือเครื่องมือที่ใช้คุยกับ Table users
    // เช่น userRepository.find(), userRepository.save()
  ) {}

  // --------------------------------
  // สร้าง User ใหม่
  // --------------------------------
  async create(data: {
    fullName: string;
    email: string;
    password: string; // ควรเป็น hashed password แล้ว
  }): Promise<User> {
    
    // สร้าง object User ใหม่
    const newUser = this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
   const savedUser = await this.userRepository.save(newUser);
    // บันทึกลง Database แล้ว return ข้อมูลที่บันทึก
    return savedUser;
  }

  logTest(){
    console.log("Hello from UsersService!");
  }
  // --------------------------------
  // หา User จาก Email
  // --------------------------------
  async findByEmail(email: string): Promise<User | null> {
this.logTest();

    return this.userRepository.findOne({
      where: { email } // WHERE email = 'xxx@xxx.com'
    });
  }

  // --------------------------------
  // หา User จาก ID
  // --------------------------------
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id } // WHERE id = 'uuid...'
    });
  }
}