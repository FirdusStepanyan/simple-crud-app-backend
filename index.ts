// import express from "express";
// import productRoute from "./routes/product.route.ts";
// import userRoute from "./routes/user.route.ts";

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use("/api/products", productRoute);
// app.use("/api/users", userRoute);

// app.get("/", (req, res) => {
//     res.send("hello");
// });

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

import express, { Request, Response } from "express";
import productRoute from "./routes/product.route";
import userRoute from "./routes/user.route";

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

// A simple test route
app.get("/", (req: Request, res: Response): void => {
    res.send("hello");
});

// Start the server
app.listen(3000, (): void => {
    console.log("Server running on port 3000");
});
