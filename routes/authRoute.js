const router = require("express").Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User1 = require("../model/User");
//REGISTER

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
