import AppDataSource from "../database";
import TimeSlotSchema, { TimeSlot } from "../models/timeSlot.model";

export class TimeSlotRepository {
  findAll(): TimeSlot[] | PromiseLike<TimeSlot[]> {
    return this.repo.find({ relations: ["user"] });
  }
  private repo = AppDataSource.getRepository<TimeSlot>(TimeSlotSchema);

  async findAllWithAdmins(skip: number, take: number): Promise<[TimeSlot[], number]> {
    return this.repo.findAndCount({
      relations: ["user"],
      where: { user: { role: "ADMIN" } },
      skip,
      take,
      order: { date: "ASC", start_time: "ASC" },
    });
  }

  async save(slot: TimeSlot) {
    return this.repo.save(slot);
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["user"] });
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}