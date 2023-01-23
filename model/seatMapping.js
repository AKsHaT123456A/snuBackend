const mongoose = require("mongoose");
const seatMappingSchema = new mongoose.Schema(
  {
   seatMap:[{type:Array,required:true}],
   price:{type:Array,required:true},
   theatreId:{type:String,required:true}
  },
  { timestamps: true }
);
const seatMap = mongoose.model("seatMap", seatMappingSchema);
module.exports = seatMap;
