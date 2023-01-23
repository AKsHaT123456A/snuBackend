const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema(
  { theatreId:{type:String,required:true},
    seatid:{type:Array, required: true},
    noOfReservedSeats:{type:Number,default:0,required:true}
  },
  { timestamps: true }
);
const SeatReserved = mongoose.model("SeatReserved", seatSchema);
module.exports = SeatReserved;
