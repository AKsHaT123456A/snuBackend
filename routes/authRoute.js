const router = require("express").Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User1 = require("../model/User");
//REGISTER
router.post("/register", async (req, res) => {
  // const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  const existingUser = await User1.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json("User already exists!");
  }
  const newUser = new User1({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    isAdmin: req.body.isAdmin,
  });
  try {
    const user = await newUser.save();

    // emailer(user.email,user.otp);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User1.findOne({ email: req.body.email });
    if(!user) return res.status(400).json("Email not found!");
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if(originalPassword !== req.body.password) 
      return res.status(400).json("Wrong Password");
    var payload = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      id: user.id,
    };
    const accessToken = jwt.sign(
      { payload},
      process.env.SECRET_KEY,
      { algorithm:'HS256',expiresIn: "1d" }
    );
    const { password, ...info } = user._doc;
    res.status(201).json({ ...info, accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/verifytoken", async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.SECRET_KEY,{algorithm:'HS256'});
    if (!verified) return res.json(false);
    const user = await User1.findById(verified.payload.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//verification
router.patch("/register/verify", async (req, res) => {
  try {
    const otp = req.body.otp;
    if (!otp)
      return res.status(400).json({
        success: false,
        message: "Send  OTP",
      });
    const userExist = await User1.findOne({ otp });
    console.log(userExist._id);
    if (!userExist.otp)
      return res.status(400).json({
        success: false,
        message: "You are not registered.",
      });
    if (userExist.otp === otp) {
      await User1.findByIdAndUpdate(
        { _id: userExist._id },
        { isVerified: true }
      );
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
router.get("/forget",async(req,res)=>{
  const user=await User1.findOneAndUpdate({email:req.body.email},{$set:{password:req.body.password}});
  if(!user)return res.status(404).json("No such user found!");
  return res.status(200).json("Password Updated!");
})
module.exports = router;
