//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./AdminRoutes/movieRoute");
mongoose.set("strictQuery", true);
require("dotenv").config();
const app = express();
app.use(express.json());
const port = 3000 || process.env.PORT;
mongoose
  .connect(process.env.DATABASE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
app.use("/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.post("/register", async (req, res) => {
  const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  const newUser = User1({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    otp:otp
  });
  try {
    const user = await newUser.save();
    // emailer(user.email,user.otp);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//LOGIN
app.post("/login", async (req, res) => {
  try {
    const user = await User1.findOne({ email: req.body.email });
    !user && res.status(401).json("Email or Username not found!");
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("Wrong Password");
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const { password, ...info } = user._doc;
    res.status(201).json({...info, accessToken});
  } catch (error) {
    res.status(500).json(error);

  }
});
app.listen(port, () => {
  console.log(`Sever running at ${port}`);
});
