import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTimeSlotsTable1680000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "time_slots",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "name", type: "varchar", length: "255" },
                    { name: "date", type: "date" },
                    { name: "start_time", type: "time" },
                    { name: "end_time", type: "time" },
                    { name: "price", type: "numeric", precision: 10, scale: 2 },
                    { name: "price_type", type: "varchar", length: "50" },
                    { name: "user_id", type: "int" },
                    { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "time_slots",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
  
        const table = await queryRunner.getTable("time_slots");
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("time_slots", foreignKey);
        }

        await queryRunner.dropTable("time_slots");
    }
}
