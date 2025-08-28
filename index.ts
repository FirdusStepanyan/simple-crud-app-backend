import express, { Request, Response } from "express";
import AppDataSource from "./src/database";
import productRoute from "./src/routes/product.route";
import userRoute from "./src/routes/user.route";
import authRoute from "./src/routes/auth.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });