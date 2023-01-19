const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: { type:String,required: true, unique: 1 },
    password: { type:String,required: true },
    isAdmin: { type: Boolean, default: false },
    email:{type:String}
  },
  { timestamps: true }
);
const User1=mongoose.model("User",UserSchema);
module.exports=User1;
