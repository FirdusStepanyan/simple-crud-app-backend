import { DataSource } from "typeorm";
import UserSchema from "./models/user.model";
import ProductSchema from "./models/product.model";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  port: 5432,
  password: "Stepanyan1@",
  database: "edo",
  synchronize: false,
  logging: true,
  entities: [UserSchema,ProductSchema],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;