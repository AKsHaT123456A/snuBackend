const router = require("express").Router();
const User1 = require("../model/User");
const jwt=require("jsonwebtoken");
// const Crypto = require("crypto-js");
const verify = require("../middleware/verifyToken");
const { findById } = require("../model/User");
//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      );
    }
    try {
      const updatedUser = await User1.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else res.status(403).json("Can't reach admin account");
});

//Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(201).send("Account Deleted!!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else res.status(403).json("You can delete only your account!");//push,pull,inc;
});
//GET
router.get("/", async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.json("No token found in header!");
    const verified = jwt.verify(token, process.env.SECRET_KEY,{algorithm:'HS256'});
    if (!verified) return res.json("Token not valid!");
    const user = await User1.findById(verified.payload.id);
    if (!user) return res.json("No such user found!");
    const {password,...info}=user._doc;
    res.json(info);
    res.setHeader("auth-token",token);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// GET ALL
router.get("/getAll", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(200).json(users);
    }
  } else res.status(403).json("You are not allowed");
});
//GET USER STATS
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "September",
    "October",
    "November",
    "December",
  ];
  try {
    const data =await User.aggregate([
        {
            $project:{
                month :{$month:"$createdAt"}
            }
        },
        {
            $group:{
                _id:{$month},
                total:{$sum:1}
            }
        }
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
