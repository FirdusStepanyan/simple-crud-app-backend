import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBookingsTable1725450000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ստեղծում ենք bookings աղյուսակը
    await queryRunner.createTable(
      new Table({
        name: "bookings",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "number_of_people",
            type: "int",
            isNullable: false,
          },
          {
            name: "price",
            type: "int",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "admin_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "slot_id",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    // Foreign keys
    await queryRunner.createForeignKeys("bookings", [
      new TableForeignKey({
        columnNames: ["admin_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["slot_id"],
        referencedTableName: "time_slots",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("bookings");
  }
}
