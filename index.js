const express = require("express");
const connection = require("./Config/database");
const{ userTable ,adminTable,reviewTable,paymentTable,pro_OrderTable,productTable}= require("./Controllers/createTables");
const  route  = require("./RoutesHandler/Routes");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.listen(3000, () => console.log("Server is running on port 3000"));

app.use('/api',route)

