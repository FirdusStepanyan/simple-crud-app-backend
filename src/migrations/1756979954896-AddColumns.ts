import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingColumnsToBookings1756979611268 implements MigrationInterface {
    name = 'AddBookingColumnsToBookings1756979611268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Booking code, յուրահատուկ համար
        await queryRunner.query(`ALTER TABLE "bookings" ADD "booking_code" character varying NOT NULL`);
        // Օրինակ description, եթե ուզում ենք ավելացնել booking-ի համար
        await queryRunner.query(`ALTER TABLE "bookings" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "booking_code"`);
    }
}
