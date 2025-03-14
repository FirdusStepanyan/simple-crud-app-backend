// import { EntitySchema } from "typeorm";

// const User = new EntitySchema({
//     name: "User", 
//     tableName: "public.users",
//     columns: {
//         id: {
//             primary: true,
//             type: "int",
//             generated: true,
//         },
//         name: {
//             type: "varchar",
//             length: 100,
//             nullable: false,
//         },
//         lastname: {
//             type: "varchar",
//             length: 100,
//             nullable: false,
//         },
//         age: {
//             type: "int",
//             nullable: false,
//         },
//     },
//     relations: {
//         products: {
//             type: "one-to-many",
//             target: "Product",
//             inverseSide: "user",
//         },
//     },
// });

// export default User;


import { EntitySchema } from "typeorm";
import { Product } from "./product.model"; 


export interface User {
    id: number;
    name: string;
    lastname: string;
    age: number;
    products: Product[];
}

const UserSchema = new EntitySchema<User>({
    name: "User",
    tableName: "public.users",
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
        lastname: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        age: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        products: {
            type: "one-to-many",
            target: "Product",
            inverseSide: "user",
        },
    },
});

export default UserSchema;
   // relations: {
    //     products: {
    //         type: "one-to-many",
    //         target: "Product",
    //         inverseSide: "user",
    //     },
    // },