const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema(
  {
    seats:[
    {
       seatid:{type:Array,required:true},
      isReserved: { type: Array}
    }]
  },
  { timestamps: true }
);
const Seat=mongoose.model("Show",seatSchema);
module.exports=Seat;
