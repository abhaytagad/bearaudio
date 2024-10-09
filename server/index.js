const express = require("express");
const  route  = require("./RoutesHandler/Routes");
const { cloudinaryConnect } = require("./Config/cloudinary");
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
app.use(express.json());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true, 
    tempFileDir: "/tmp/",
  })
);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.listen(process.env.PORT, () => console.log("Server is running on port 4000"));

cloudinaryConnect()
app.use('/api',route)

