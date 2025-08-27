// src/models/user.model.ts
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
}

const UserSchema = new EntitySchema<User>({
    name: "User",
    tableName: "users",
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String },
        lastname: { type: String },
        age: { type: Number },
        email: { type: String },
        password: { type: String },
        role: { type: "enum", enum: USER_ROLES, default: USER_ROLES.USER },
    },
    relations: {
        products: { type: "one-to-many", target: "Product", inverseSide: "user" },
    },
});

export default UserSchema;
