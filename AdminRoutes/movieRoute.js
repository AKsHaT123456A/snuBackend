const router = require("express").Router();
const Movie = require("../model/movie");
const { findById } = require("../model/User");
const SeatReserved = require("../model/seats");
const seatMapping = require("../model/seatMapping");
const User = require("../model/User");
const Datedetails = new Date();
//CREATE
router.post("/:id/getTheatrebyMovies", async (req, res) => {
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
router.get("/find/:theatre", async (req, res) => {
  try {
    let newSeatDetails = [{}];
    let newSeatReservation = [];
    const show = await Movie.findOne({ theatre: req.params.theatre }).sort({
      _id: -1,
    });
    //numberof shows to be given by admin console.log(show[1].shows[0].noOfSeats);
    let j = 1;
    let isReserved = false;
    let theatre = req.params.theatre;
    for (var i = 0; i < show[0].shows[0].noOfSeats; i++) {
      newSeatDetails.splice(i, 0, `${theatre}${show[0].shows[0].audi}${i}`),
        (newSeatReservation[i] = isReserved);
    }
    const newseatDetails = new Seats({
      seats: [{ seatid: [newSeatDetails] }],
      isReserved: [newSeatReservation],
    });
    const SeatDetails = await newseatDetails.save();
    res.status(201).json(SeatDetails);
  } catch (error) {
    res.status(501).json(error);
  }
});
router.get("/reservation", async (req, res) => {
  const { noOfReservedSeats, seatid } = req.body;
  const theatreId = req.body.theatreId;
  seatidArray = [];
  const Newseat = await SeatReserved.findOne({ theatreId });
  // console.log(Newseat);

  if (!Newseat) {
    const theatreId = req.body.theatreId;
    // console.log(theatreId);
    for (var i = 0; i < noOfReservedSeats; i++) {
      seatidArray[i] = seatid[i];
    }
    // console.log(seatidArray);
    const newReservation = new SeatReserved({
      seatid: seatidArray,
      noOfReservedSeats: noOfReservedSeats,
      theatreId: theatreId,
    });
    Reservation = await newReservation.save();
    // console.log(Reservation);
    return res.status(200).json(Reservation);
  }
  if (Newseat) {
    const newSeats = Newseat.noOfReservedSeats + noOfReservedSeats;
    for (var i = 0; i < Newseat.noOfReservedSeats; i++) {
      seatidArray[i] = Newseat.seatid[i];
    }
    let j = 0;
    for (var i = Newseat.noOfReservedSeats; i < newSeats; i++) {
      seatidArray[i] = seatid[j];
      j++;
    }
    // console.log(seatidArray);
    // console.log(Newseat._id)
    const UpdatedReservation = await SeatReserved.findByIdAndUpdate(
      { _id: Newseat._id },
      { $set: { seatid: seatidArray, noOfReservedSeats: newSeats } }
    );
    return res.status(200).json(UpdatedReservation.seatid);
  }
});
router.post("/Cancellation", async (req, res) => {
  const { noOfCancelledSeats, seatid } = req.body;
  const theatreId = req.body.theatreId;
  const Newseat = await SeatReserved.findOne({ theatreId: theatreId });
  const newSeats = Newseat.noOfReservedSeats - noOfCancelledSeats; //noOfSeats to be changed to noOfReservedSeats
  const Number=Newseat.seatid.length;
  let j=0,c=0;
  for(var i=0;i<Number;i++){
      if(Newseat.seatid[i]===seatid[j]&&j<noOfCancelledSeats){
             c++;
             j++;
      }
  }
  if(c!==noOfCancelledSeats) return res.status(404).json("No such seat found");
  for(var i=0;i<noOfCancelledSeats;i++)
  {Newseat.seatid.remove(seatid[i]);}
  newSeatCancelled=Newseat.seatid;
  UpdatedReservation = await SeatReserved.findByIdAndUpdate(
    { _id: Newseat._id },
    { $set: { seatid:newSeatCancelled , noOfSeats: newSeats } }
  );
  const UpdatedReservationSeat= await SeatReserved.findById({_id:Newseat._id});
  return res.status(200).json(UpdatedReservationSeat.seatid);
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

// // GET ALL
// router.get("/", verify, async (req, res) => {
//   const query = req.query.new;
//   if (req.user.isAdmin) {
//     try {
//       const users = query
//         ? await User.find().sort({ _id: -1 }).limit(10)
//         : await User.find();
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(200).json(users);
//     }
//   } else res.status(403).json("You are not allowed");
// });
// //GET USER STATS
// router.get("/stats", async (req, res) => {
//   const today = new Date();
//   const lastYear = today.setFullYear(today.setFullYear() - 1);
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   try {
//     const data = await User.aggregate([
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
module.exports = router;
