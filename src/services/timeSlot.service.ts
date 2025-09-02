import { UserRepository } from "../repositories/user.repositori";
import { TimeSlotRepository } from "../repositories/timeSlot.repositori";
import { TimeSlot, PriceType } from "../models/timeSlot.model";
import { User } from "../models/user.model";

class TimeSlotService {
  private timeSlotRepo = new TimeSlotRepository();
  private userRepo = new UserRepository();

  async createTimeSlot(adminId: number, data: Partial<TimeSlot>) {
    const admin = await this.userRepo.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    const slot: TimeSlot = {
      ...data,
      user: admin,
      priceType: data.priceType || PriceType.SUBTOTAL,
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





  //////////////ավելացնել update
  async deleteTimeSlot(id: number) {
    const slot = await this.timeSlotRepo.findById(id);
    if (!slot) throw new Error("Time slot not found");
    await this.timeSlotRepo.delete(id);
    return { message: "Time slot deleted successfully" };
  }
}

export default new TimeSlotService();
