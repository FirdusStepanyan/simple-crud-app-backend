import { MigrationInterface, QueryRunner } from "typeorm";

export class Verifi1756371950115 implements MigrationInterface {
    name = 'Verifi1756371950115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email_verifi_code" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verifi_code"`);
    }

}