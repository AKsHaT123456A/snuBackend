//jshint esversion:6
const express = require("express");
const cors=require("cors")
const path =require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./AdminRoutes/movieRoute");
const emailRoute = require("./AdminRoutes/emailRoutes");
mongoose.set("strictQuery", true);
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const PORT = 3000 || process.env.PORT;
mongoose
  .connect(process.env.DATABASE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/success", emailRoute);
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
