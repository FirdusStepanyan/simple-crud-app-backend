import { UserRepository } from "../repositories/user.repositori";
import { TimeSlotRepository } from "../repositories/timeSlot.repositori";
import { TimeSlot, PriceType } from "../models/timeSlot.model";

class TimeSlotService {
  private timeSlotRepo = new TimeSlotRepository();
  private userRepo = new UserRepository();

  private async isOverlapping(adminId: number, date: Date | string, startTime: string, endTime: string): Promise<boolean> {
    const slots: TimeSlot[] = await this.timeSlotRepo.findAll();

    const dateObj = typeof date === "string" ? new Date(date) : date;

    const adminSlots = slots.filter(
      s => s.user.id === adminId && new Date(s.date).toDateString() === dateObj.toDateString()
    );

    for (const slot of adminSlots) {
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;

      if (
        (startTime >= slotStart && startTime < slotEnd) ||
        (endTime > slotStart && endTime <= slotEnd) ||
        (startTime <= slotStart && endTime >= slotEnd)
      ) {
        return true;
      }
    }

    return false;
}

  async createTimeSlot(adminId: number, data: Partial<TimeSlot>) {
    const admin = await this.userRepo.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    if (!data.date || !data.start_time || !data.end_time) {
      throw new Error("Date, start_time and end_time are required");
    }

    if (await this.isOverlapping(adminId, data.date, data.start_time, data.end_time)) {
      throw new Error("This time slot overlaps with an existing one for this admin.");
    }

    const slot: TimeSlot = {
      ...data,
      user: admin,
      price_type: data.price_type || PriceType.SUBTOTAL,
    } as TimeSlot;

    return this.timeSlotRepo.save(slot);
  }

  async getAllTimeSlots() {
    return this.timeSlotRepo.findAll();
  }

  async getTimeSlotById(id: number) {
    const slot = await this.timeSlotRepo.findById(id);
    if (!slot) throw new Error("Time slot not found");
    return slot;
  }

  async updateTimeSlot(id: number, data: Partial<TimeSlot>) {
    const slot = await this.timeSlotRepo.findById(id);
    if (!slot) throw new Error("Time slot not found");

    Object.assign(slot, data);

    if (data.date && data.start_time && data.end_time) {
      const adminId = slot.user.id;
      if (await this.isOverlapping(adminId, data.date, data.start_time, data.end_time)) {
        throw new Error("Updated time slot overlaps with existing slot for this admin.");
      }
    }

    return this.timeSlotRepo.save(slot);
  }

  async deleteTimeSlot(id: number) {
    const slot = await this.timeSlotRepo.findById(id);
    if (!slot) throw new Error("Time slot not found");

    await this.timeSlotRepo.delete(id);
    return { message: "Time slot deleted successfully" };
  }
}

export default new TimeSlotService();
