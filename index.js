import express from "express";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});