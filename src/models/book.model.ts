import { EntitySchema } from "typeorm";
import UserSchema, { User } from "./user.model";
import TimeSlotSchema, { TimeSlot } from "./timeSlot.model";

export interface Booking {
  id: number;
  admin: User;
  user: User;
  time_slot_id: TimeSlot;
  number_of_people: number;
  price: number;
  booking_code: string;
  description?: string;
  createdAt: Date;
}

const BookingSchema = new EntitySchema<Booking>({
  name: "Booking",
  tableName: "bookings",
  columns: {
    id: { type: Number, primary: true, generated: true },
    number_of_people: { type: Number },
    price: { type: Number },
    booking_code: { type: String },
    description: { type: String, nullable: true },
    createdAt: { type: Date, createDate: true },
  },
  relations: {
    admin: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "admin_id" },
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
    },
    time_slot_id: {
      type: "many-to-one",
      target: "TimeSlot",
      joinColumn: { name: "slot_id" },
    },
  },
});

export default BookingSchema;
