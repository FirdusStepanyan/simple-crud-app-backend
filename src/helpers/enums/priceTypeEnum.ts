import { TimeSlot, PriceType } from "../../models/timeSlot.model";
import { User } from "../../models/user.model";

function createTimeSlot(admin: User, data: Partial<TimeSlot>): TimeSlot {
  const slot: TimeSlot = {
    ...data,
    user: admin,
    priceType: data.priceType || PriceType.SUBTOTAL,
  } as TimeSlot;

  return slot;
}
