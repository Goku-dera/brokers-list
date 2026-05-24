import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBrokersTable1779625110953 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "broker_type_enum" AS ENUM ('cfd', 'bond', 'stock', 'crypto')
    `);

    await queryRunner.createTable(
      new Table({
        name: "brokers",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,  // ✅ slug ต้องไม่ซ้ำกัน
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "logo_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "website",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "broker_type",
            type: "broker_type_enum",  // ✅ ใช้ ENUM ที่สร้างไว้
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true // ✅ ifNotExists = true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ✅ ลบ Table ก่อน แล้วค่อยลบ ENUM
    await queryRunner.dropTable("brokers", true);
    await queryRunner.query(`DROP TYPE IF EXISTS "broker_type_enum"`);
  }
}