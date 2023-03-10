const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String,required:true,unique:true
    //   validate: {
    //   validator: function (v) {
    //     var re = /^[a-z @.A-Z]+$'/;
    //     return !v || !v.trim().length || re.test(v);
    //   },
    //   message: "Provided username is invalid.",
    // },
  },
    phone: {
      type: String,
      // required: true,

      maxLength: [10, "Max length should be 10"],
      validate: {
        validator: function (v) {
          var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
          return !v || !v.trim().length || re.test(v);
        },
        message: "Provided phone number is invalid.",
      },
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    email: { type: String, required: true,validate: {
      validator: function (v) {
        var re = /[a-z @.A-Z]+$/;//add . 
        return !v || !v.trim().length || re.test(v);
      },
      message: "Provided email is invalid.",
    }, },//[a-z @.A-Z]+$
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
