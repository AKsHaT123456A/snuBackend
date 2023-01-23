const router = require("express").Router();
const Movie = require("../model/movie");
//Cancellation API,QR API,TICKET SENDER
const { findById } = require("../model/User");
const SeatReserved = require("../model/seats");
const seatMapping = require("../model/seatMapping");
const User = require("../model/User");
const Datedetails = new Date();
//CREATE
router.post("/:id/getMoviesByTheatre", async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (user.isAdmin) {
    const newMovie = Movie({
      moviename: req.body.moviename,
      theatre: req.body.theatre,
      shows: req.body.shows,
    });
    try {
      const movie = await newMovie.save();
      res.status(201).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(403).json("YOU ARE NOT AUTHENTICATED");
});
//GET
router.get("/reservation", async (req, res) => {
  const { noOfSeats, seatid } = req.body;
  const theatreId = req.body.theatreId;
  seatidArray = [];
  const Newseat = await SeatReserved.findOne({ theatreId });

  if (!Newseat) {
    const theatreId = req.body.theatreId;
    for (var i = 0; i < noOfSeats; i++) {
      seatidArray[i] = seatid[i];
    }
    console.log(seatidArray);
    const newReservation = new SeatReserved({
      seatid: seatidArray,
      noOfSeats: noOfSeats,
      theatreId: theatreId,
    });
    Reservation = await newReservation.save();
    return res.status(200).json(Reservation);
  }
  if (Newseat) {
    const newSeats = Newseat.noOfSeats + noOfSeats;
    for (var i = 0; i < Newseat.noOfSeats; i++) {
      seatidArray[i] = Newseat.seatid[i];
    }
    let j = 0;
    for (var i = Newseat.noOfSeats; i < newSeats; i++) {
      seatidArray[i] = seatid[j];
      j++;
    }
    console.log(seatidArray);
    // console.log(Newseat._id)
    UpdatedReservation = await SeatReserved.findByIdAndUpdate(
      { _id: Newseat._id },
      { $set: { seatid: seatidArray, noOfSeats: newSeats } }
    );
    return res.status(200).json(UpdatedReservation.seatid);
  }
});
router.get("/seatMapping", async (req, res) => {
  const seatMap = req.body.seatMap;
  const price = req.body.price;
  const theatreId = req.body.theatreId; //need theatre id from
  const newmapDetails = new seatMapping({
    seatMap: seatMap,
    price: price,
    theatreId: theatreId,
  });
  const mapDetails = await newmapDetails.save();
  res.status(200).json(mapDetails);
});
router.post("/seatMappingReservation", async (req, res) => {
  const seatmap = await seatMapping.findOne({ theatreId: req.body.theatreId });
  if (!seatmap) return res.status(404).json("No such mapping found!");
  const { theatreId, ...info } = seatmap._doc;
  res.status(200).json(info);
});
module.exports = router;
