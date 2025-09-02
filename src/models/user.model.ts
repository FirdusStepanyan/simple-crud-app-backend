import { EntitySchema } from "typeorm";
import { Product } from "./product.model";
import { USER_ROLES, UserRole } from "../roles";

export interface User {
  id: number;
  name: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
  role: UserRole;
  products: Product[];
  email_verifi_code: number | null;
  is_verified: boolean;
  image?: string; // <-- նկարի path
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
    image: { type: String, nullable: true }, // <-- նկարի path
  },
  relations: {
    products: { type: "one-to-many", target: "Product", inverseSide: "user" },
  },
});

export default UserSchema;
