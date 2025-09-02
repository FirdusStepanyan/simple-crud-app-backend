import { MigrationInterface, QueryRunner } from "typeorm";
import { USER_ROLES } from "../helpers/enums/roles";

export class AddRoleToUser1756306476640o implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM ('${USER_ROLES.ADMIN}', '${USER_ROLES.USER}');
        `);

        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD COLUMN "role" "user_role_enum" NOT NULL DEFAULT '${USER_ROLES.USER}';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            DROP COLUMN "role";
        `);

        await queryRunner.query(`
            DROP TYPE "user_role_enum";
        `);
    }
}