import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumsLocCuiTaxMinMaxBook1756895131406 implements MigrationInterface {
    name = 'addColumsLocCuiTaxMinMaxBook1756895131406'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "time_slots" ADD "location" varchar NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD "cuisine" varchar NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD "tax" numeric(5,2) NOT NULL `);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD "min_book_count" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "time_slots" ADD "max_book_count" integer NOT NULL DEFAULT 1`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_slots" DROP COLUMN "max_book_count"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP COLUMN "min_book_count"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP COLUMN "tax"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP COLUMN "cuisine"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP COLUMN "location"`);
    }
}
