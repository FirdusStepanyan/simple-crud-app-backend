import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnImage1756801916787 implements MigrationInterface {
    name = 'AddColumnImage1756801916787'

    public async up(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.query(`ALTER TABLE "users" ADD "image" varchar`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image"`);
    }

}
