import { EntitySchema } from "typeorm";
import { User } from "./user.model";

export enum PriceType {
  SUBTOTAL = "subtotal",
  PER_PRICE = "per_price",
}

export interface TimeSlot {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  startTime: string; // or Date if needed
  endTime: string;
  price: number;
  priceType: PriceType;
  user: User;
}

const TimeSlotSchema = new EntitySchema<TimeSlot>({
  name: "TimeSlot",
  tableName: "time_slots",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    price: { type: Number },
    priceType: { type: "enum", enum: PriceType, default: PriceType.SUBTOTAL },
  },
  relations: {
    user: { type: "many-to-one", target: "User", joinColumn: true },
  },
});

export default TimeSlotSchema;
