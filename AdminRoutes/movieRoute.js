const router = require("express").Router();
const Movie = require("../model/movie");
const { findById } = require("../model/User");
const Seats = require("../model/seats");
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
//UPDATE
// router.put("/:id", verify, async (req, res) => {
//   if (req.user.id === req.params.id || req.user.isAdmin) {
//     if (req.body.password) {
//       req.body.password = CryptoJS.AES.decrypt(
//         user.password,
//         process.env.SECRET_KEY
//       );
//     }
//     try {
//       const updatedUser = await User1.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );
//       res.status(201).json(updatedUser);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else res.status(403).json("Can't reach admin account");
// });
// //Delete
// router.delete("/:id", verify, async (req, res) => {
//   if (req.user.id === req.params.id || req.user.isAdmin) {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.status(201).send("Account Deleted!!");
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else res.status(403).json("You can delete only your account!");
// });
//GET
router.get("/find/:theatre", async (req, res) => {
  try {
    let newSeatDetails = [{}];
    let newSeatReservation = [];
    const show = await Movie.find({ theatre: req.params.theatre }).sort({
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
    const newseatDetails = Seats({
      seats: [{ seatid: [newSeatDetails, newSeatReservation] }],
    });
    const SeatDetails = await newseatDetails.save();
    res.status(201).json(SeatDetails);
  } catch (error) {
    res.status(501).json(error);
  }
});
router.get("/:nofSeats", (req, res) => {
  let isReserved =[];
  let seatId = [];
  isReserved=[true];
  let isNotReserved=[false];
  let noOfSeats=req.params.nofSeats;
  // console.log(req.query.seatid + " " + req.params.nofSeats);
  for (var i = 0; i < noOfSeats; i++) {
    let seattid=[];
    seatId[i] = req.query.seatid;
    // console.log(seatId[0][i]);
    seattid=[seatId[0][i]];
    console.log(seattid);
    async (req, res) => {
      const seatids = await Seats.findOne({ seats:[{seatid:[seattid,isNotReserved]}] });
      console.log(seatids);
      let id = seatids._id;
      const Updatedseatids = await Seats.findByIdAndUpdate(
        { id },
        { $set: { seats: [{ seatid: [seatId[i],isReserved] }] } }
      );}
    console.log("OK");
      // res.status(202).json(Updatedseatids);
  }
  // console.log(seatId[5][0].split(" ")[1]);
  // console.log(seatId.length);
});
// catch(error){
//   res.status(500).json(error);
// }
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
