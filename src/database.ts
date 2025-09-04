import { DataSource } from "typeorm";
import UserSchema from "./models/user.model";
import ProductSchema from "./models/product.model";
import TimeSlotSchema from "./models/timeSlot.model";
import BookingSchema from "./models/book.model";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Stepanyan1@",
  database: "edo",
  synchronize: false,
  logging: true,
  entities: [UserSchema, ProductSchema, TimeSlotSchema, BookingSchema],
  migrations: [__dirname + "/migrations/*.ts"],
});
export default AppDataSource;