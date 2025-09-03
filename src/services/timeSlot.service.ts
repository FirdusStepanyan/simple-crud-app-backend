import { UserRepository } from "../repositories/user.repositori";
import { TimeSlotRepository } from "../repositories/timeSlot.repositori";
import { TimeSlot, PriceType } from "../models/timeSlot.model";

class TimeSlotService {
  private timeSlotRepo = new TimeSlotRepository();
  private userRepo = new UserRepository();

  async createTimeSlot(adminId: number, data: Partial<TimeSlot>) {
    const admin = await this.userRepo.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    const slot = {
      ...data,
      user: admin,
      priceType: data.price_type || PriceType.SUBTOTAL,
    } as unknown as TimeSlot;


    let ssss = await this.timeSlotRepo.save(slot);

    return ssss
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