// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --------------------------------
  // เปิดใช้งาน Validation
  // --------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // whitelist: true = ตัดข้อมูลที่ไม่ได้ระบุใน DTO ทิ้ง
      // เช่น ถ้า User ส่ง field แปลกๆ มา จะถูกตัดทิ้งอัตโนมัติ
      
      forbidNonWhitelisted: true,
      // forbidNonWhitelisted: true = ถ้าส่ง field ที่ไม่รู้จักมา
      // จะ return error เลย (ปลอดภัยกว่า)
      
      transform: true,
      // transform: true = แปลงข้อมูลให้ตรงกับ Type ที่กำหนด
    }),
  );

  // เปิด CORS ให้ Frontend เรียกได้
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
  });

  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();