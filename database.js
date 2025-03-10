import { DataSource } from "typeorm";
import User from "./models/user.model.js"; 
import Product from "./models/product.model.js";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  port: 5432,
  password: "Stepanyan1@",
  database: "edo",
  synchronize: false,
  logging: true,
  entities: [User, Product],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;