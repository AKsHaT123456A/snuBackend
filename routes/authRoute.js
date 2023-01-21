const router = require("express").Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User1 = require("../model/User");
//REGISTER
router.post("/register", async (req, res) => {
  // const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  const newUser = User1({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    isAdmin:req.body.isAdmin
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
router.post("/login", async (req, res) => {
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
//verification
router.patch("/register/verify", async (req, res) => {
  try {
    const otp =req.body.otp;
    if (!otp)
      return res.status(400).json({
        success: false,
        message: "Send  OTP",
      });
    const userExist = await User1.findOne({otp});
    console.log(userExist._id);
    if (!userExist.otp)
      return res.status(400).json({
        success: false,
        message: "You are not registered.",
      });
    if (userExist.otp === otp) {
      await User1.findByIdAndUpdate({ _id: userExist._id}, { isVerified: true });
      res.status(200).json({
        success: true,
        message: "OTP correct. User is verified.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
});
module.exports = router;
