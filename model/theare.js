const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema(
  {
    theatrename: { type: String, required: true},
    movie:{
      type: String,
      required: true,
    },
    location:{type:String},
    shows: [
      {
        audi: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        noOfSeats: {
          type: Number,
          required: true,
        },
        date:{
          type:String ,
          required:true
        }
      },
    ],
  },
  { timestamps: true }
);
const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
