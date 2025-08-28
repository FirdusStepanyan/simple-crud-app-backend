import { DataSource } from "typeorm";
import ProductSchema from "./models/product.model";
import UserSchema from "./models/user.model";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Stepanyan1@",
    database: "edo",
    synchronize: false,
    logging: true,
    entities: [UserSchema, ProductSchema],
    migrations: [__dirname + "/migrations/*.ts"],
});
export default AppDataSource;