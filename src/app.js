const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/database");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is runing ");
});

connectDB()
  .then(() => {
    console.log("Database is connected Successfully");
    app.listen(3000, () => {
      console.log("Server is runing on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database is not connected...");
  });
