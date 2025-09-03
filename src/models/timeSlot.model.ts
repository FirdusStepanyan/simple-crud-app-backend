import { EntitySchema } from "typeorm";
import UserSchema, { User } from "./user.model";

export enum PriceType {
  SUBTOTAL = "subtotal",
  PER_PRICE = "per_price",
}

export interface TimeSlot {
  id: number;
  name: string;
  date: Date;
  start_time: string;
  end_time: string;
  price: number;
  price_type: PriceType;
  user: User;
}

const TimeSlotSchema = new EntitySchema<TimeSlot>({
  name: "TimeSlot",
  tableName: "time_slots",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    date: { type: Date },
    start_time: { type: String },
    end_time: { type: String },
    price: { type: Number },
    price_type: { type: "enum", enum: PriceType, default: PriceType.SUBTOTAL },
  },
  relations: {
    user: {
      type: "many-to-one", target: () => "User", joinColumn: { name: "user_id" },
      nullable: false
    },
  },
});

export default TimeSlotSchema;
