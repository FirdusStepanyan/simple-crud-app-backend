import { EntitySchema } from "typeorm";

const Product = new EntitySchema({
    name: "Product",
    tableName: "public.products",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        quantity: {
            type: "int",
            nullable: false,
        },
        price: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default Product;