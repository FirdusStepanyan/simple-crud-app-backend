import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTimeSlotsTable1680000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "time_slots",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "name", type: "varchar", length: "255" },
                    { name: "start_date", type: "date" },
                    { name: "end_date", type: "date" },
                    { name: "start_time", type: "time" },
                    { name: "end_time", type: "time" },
                    { name: "price", type: "numeric", precision: 10, scale: 2 },
                    { name: "price_type", type: "varchar", length: "50" },
                    { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("time_slots");
    }
}
