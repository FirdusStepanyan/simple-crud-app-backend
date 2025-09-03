import { EntitySchema } from "typeorm";
import ProductSchema, { Product } from "./product.model";
import TimeSlotSchema, { TimeSlot } from "./timeSlot.model";
import { USER_ROLES, UserRole } from "../helpers/enums/roles";

export interface User {
  id: number;
  name: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
  role: UserRole;
  products: Product[];
  timeSlots?: TimeSlot[];
  email_verifi_code: number | null;
  is_verified: boolean;
  image?: string;
}

const UserSchema = new EntitySchema<User>({
  name: "User",
  tableName: "users",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    lastname: { type: String },
    age: { type: Number },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: "enum", enum: USER_ROLES, default: USER_ROLES.USER },
    email_verifi_code: { type: Number, nullable: true },
    is_verified: { type: Boolean, default: false },
    image: { type: String, nullable: true },
  },
  relations: {
    products: {
      type: "one-to-many",
      target: () => "Product",
      inverseSide: "user",
    },
    timeSlots: {
      type: "one-to-many",
      target: () => "TimeSlot",
      inverseSide: "user",
    },
  },
});

export default UserSchema;
