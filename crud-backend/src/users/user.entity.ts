// src/users/user.entity.ts

// Import decorator ต่างๆ จาก TypeORM
// Decorator คือ @ ที่เห็นข้างล่าง ทำหน้าที่เพิ่มความสามารถพิเศษให้ class
import {
  Entity,           // บอกว่า class นี้คือ Table ใน Database
  PrimaryGeneratedColumn, // คอลัมน์ id ที่ generate อัตโนมัติ
  Column,           // คอลัมน์ทั่วไป
  CreateDateColumn, // คอลัมน์ที่บันทึกเวลาสร้างอัตโนมัติ
  UpdateDateColumn, // คอลัมน์ที่บันทึกเวลาอัปเดตอัตโนมัติ
  DeleteDateColumn, // คอลัมน์สำหรับ Soft Delete
} from 'typeorm';

@Entity('users') // ← บอกว่า Table นี้ชื่อ 'users' ใน Database
export class User {
  
  // --------------------------------
  // คอลัมน์ id
  // --------------------------------
  @PrimaryGeneratedColumn('uuid')
  // uuid = unique id เช่น "550e8400-e29b-41d4-a716-446655440000"
  // ดีกว่าเลข 1,2,3 เพราะเดาไม่ได้ และไม่ซ้ำกันแน่นอน
  id!: string;

  // --------------------------------
  // คอลัมน์ full_name
  // --------------------------------
  @Column({ 
    name: 'full_name',  // ชื่อคอลัมน์ใน Database
    type: 'varchar',    // ประเภทข้อมูล = ข้อความ
    length: 100         // ความยาวสูงสุด 100 ตัวอักษร
  })
  fullName!: string;
  // หมายเหตุ: ใน TypeScript เราใช้ fullName (camelCase)
  // แต่ใน Database จะเก็บเป็น full_name (snake_case)

  // --------------------------------
  // คอลัมน์ email
  // --------------------------------
  @Column({ 
    type: 'varchar', 
    length: 255,
    unique: true  // ← ห้ามซ้ำ! email ต้องไม่ซ้ำกัน
  })
  email!: string;

  // --------------------------------
  // คอลัมน์ password
  // --------------------------------
  @Column({ 
    type: 'varchar', 
    length: 255 
  })
  password!: string;
  // password จะถูก hash ก่อนบันทึก (ทำใน Service)
  // ไม่เก็บ password จริงๆ ใน Database เด็ดขาด!

  // --------------------------------
  // คอลัมน์ created_at
  // --------------------------------
  @CreateDateColumn({ 
    name: 'created_at'  // ชื่อคอลัมน์ใน Database
  })
  // TypeORM จะบันทึกเวลาให้อัตโนมัติตอน INSERT
  createdAt!: Date;

  // --------------------------------
  // คอลัมน์ updated_at
  // --------------------------------
  @UpdateDateColumn({ 
    name: 'updated_at' 
  })
  // TypeORM จะอัปเดตเวลาให้อัตโนมัติตอน UPDATE
  updatedAt!: Date;

  // --------------------------------
  // คอลัมน์ deleted_at (Soft Delete)
  // --------------------------------
  @DeleteDateColumn({ 
    name: 'deleted_at',
    nullable: true  // ← ค่าเริ่มต้นเป็น null (ยังไม่ถูกลบ)
  })
  // Soft Delete คือ ไม่ลบข้อมูลจริงๆ
  // แค่บันทึกเวลาที่ "ลบ" ไว้
  // ถ้า deleted_at = null  → ยังใช้งานอยู่
  // ถ้า deleted_at = เวลา → ถูก "ลบ" แล้ว
  deletedAt!: Date | null;
}