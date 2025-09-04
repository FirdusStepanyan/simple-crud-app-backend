import AppDataSource from "../database";
import BookingSchema, { Booking } from "../models/book.model";

export class BookingRepository {
  private repo = AppDataSource.getRepository(BookingSchema);

  async createBooking(data: Partial<Booking>) {
    const booking = this.repo.create(data);
    return this.repo.save(booking);
  }

  async findOneByUserAndSlot(userId: number, slotId: number) {
    return this.repo.findOne({
      where: { user: { id: userId }, time_slot_id: { id: slotId } },
    });
  }

  async findAll() {
    return this.repo.find({ relations: ["user", "admin", "time_slot_id"] });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["user", "admin", "time_slot_id"] });
  }

  async updateBooking(id: number, data: Partial<Booking>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async deleteBooking(id: number) {
    const booking = await this.findById(id);
    if (!booking) return null;
    await this.repo.delete(id);
    return booking;
  }
}
