import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1779527140992 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'full_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,   // ← null = ยังไม่ถูกลบ
                    },
                ],
            }),
            true, // ← ifNotExists = ถ้ามีอยู่แล้วไม่ error
        );

        // ✅ เปิดใช้งาน uuid_generate_v4() ใน PostgreSQL
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ← ย้อนกลับ = ลบ Table ทิ้ง
        await queryRunner.dropTable('users');
    }
}