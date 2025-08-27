import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndPasswordToUser1688456723456 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_email"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "email"`);
    }
}
