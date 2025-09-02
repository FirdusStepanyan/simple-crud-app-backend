import AppDataSource from "../database";
import TimeSlotSchema, { TimeSlot } from "../models/timeSlot.model";

export class TimeSlotRepository {
  private repo = AppDataSource.getRepository<TimeSlot>(TimeSlotSchema);

  async findAll() {
    return this.repo.find({ relations: ["user"] });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["user"] });
  }

  async save(timeSlot: TimeSlot) {
    return this.repo.save(timeSlot);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}

export default new TimeSlotRepository();
