const mongoose = require("mongoose");

const audiSchema = mongoose.Schema({
  audiId: {//theatreId + audiName
    required: true,
    type: String,
    trim: true,
  },
  numberOfRows: {
      required: true,
      type: String,
  },
  numberOfColumns: {
    required: true,
    type: String,
  },
  typesOfSeats:{
    required : true,
    type: String,
  },
  noOfseats:{
    type:Number,
    required:true
  },
  seats: {
    required: true,
    type: Array,
  },
});

const Audi = mongoose.model("Audi", audiSchema);
module.exports = Audi;