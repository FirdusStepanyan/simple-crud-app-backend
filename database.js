const { Client } = require("pg");

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Stepanyan1@",  
    database: "edo"
});

con.connect()
    .then(() => console.log("PostgreSQL Connected"))
    .catch(err => console.error("PostgreSQL Connection Error:", err));

module.exports = con;  