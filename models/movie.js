const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  movieName: {
    required: true,
    type: String,
    
  },
  movieId: { //theatre name + cityname
      required: true,
      type: String,
      trim:true,
      
  },
  city: {
    required: true,
    type: String,
  },
});
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;