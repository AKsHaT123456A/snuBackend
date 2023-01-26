const mongoose = require("mongoose");

const theatreSchema = mongoose.Schema({
  theatreName: {
    required: true,
    type: String,
    
  },
  theatreId: { //theatre name + cityname
      required: true,
      type: String,
      trim:true,
      
  },
  city: {
    required: true,
    type: String,
  },
});

const Theatre = mongoose.model("Theatre", theatreSchema);
module.exports = Theatre;