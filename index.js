const express = require("express")
const Product = require('./models/product.model.js');
const productRoute = require("./routes/product.route.js");
const User = require('./models/user.model.js');
const userRoute = require("./routes/user.route.js");

const app = express()



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

app.get('/', (req, res) => {
    res.send("hello");
});

        app.listen(3000, () => {
            console.log("hi")
        });

const con = require("./database.js");

