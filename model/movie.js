const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema(
  {
    moviename: { type: String, required: true, unique: 1 },
    theatre: {
      type: String,
      required: true,
    },
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
