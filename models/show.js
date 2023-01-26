const mongoose = require("mongoose");

const showSchema = mongoose.Schema({
  showId: { //theatreId + date + time
    required: true,
    type: String,
    trim: true,
  },
  theatreId: { //theatre name + cityname
      required: true,
      type: String,
  },
  movieId: { //movie name + release date
    type: String,
  },
  movieName:{
    required:true,
    type:String
  },
  date: {
    required: true,
    type: String,
  },
  time: {
    required: true,
    type: String,
  },
  audi: {
    required: true,
    type: String,
  },

  prices: {
    required: true,
    type: Array,
  },
  noOfBookedSeats:{required : true,
    type: Number},
  bookedSeats:{
    required : true,
    type: Array,
  }
});

const Show = mongoose.model("Show", showSchema);
module.exports = Show;