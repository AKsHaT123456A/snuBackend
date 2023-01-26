const router = require("express").Router();
const Theatre = require("../models/theatre");
const City = require("../models/city");
const Show = require("../models/show");
const Audi = require("../models/audi");
const Movie = require("../models/movie");
const { json } = require("body-parser");
//add theatre by admin
//check for admin later
router.post("/addTheatre", async (req, res) => {
  try {
    const { theatreName, city } = req.body;
    const theatreId = theatreName + city;
    const existingTheatreId = await Theatre.findOne({ theatreId });
    if (existingTheatreId) {
      return res
        .status(400)
        .json({ msg: "Theatre with same name and city already exists!" });
    }
    let Newtheatre = new Theatre({
      theatreId,
      theatreName,
      city,
    });

    theatre = await Newtheatre.save();
    const existingCity = await City.findOne({ city });
    if (existingCity == null) {
      let newCity = new City({
        city,
      });
      CityAdded = await newCity.save();
    }
    res.status(201).json(theatre);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//add audis
router.post("/addAudi", async (req, res) => {
  try {
    const { audiId, numberOfRows, numberOfColumns, typesOfSeats, seats } =
      req.body;

    const existingAudi = await Audi.findOne({ audiId });

    if (existingAudi) {
      return res.status(400).json({ msg: "Audi Already Exists!" });
    }

    let audi = new Audi({
      audiId,
      numberOfColumns,
      numberOfRows,
      typesOfSeats,
      seats,
    });

    audi = await audi.save();
    res.json(audi);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//add shows
router.post("/addShow", async (req, res) => {
  try {
    const {
      theatreId,
      date,
      movieName,
      releaseDate,
      time,
      audi,
      prices,
      bookedSeats,
    } = req.body;
    const movieId=movieName+releaseDate;
    const showId=theatreId+date+time;
    const existingShow = await Show.findOne({ showId });

    if (existingShow) {
      return res
        .status(400)
        .json({
          msg: "Show In same audi for same movie at same time already exists!",
        });
    }
    let Newshow = new Show({
      showId,
      theatreId,
      movieId,
      movieName,
      date,
      time,
      audi,
      bookedSeats,
      // typesOfPrices,
      prices,
    });
    show = await Newshow.save();
    const oldMovie=await Movie.find({movieId:movieId});
    if(!oldMovie){
    let Newmovie = new Movie({
      movieId,
      movieName,
      city,
    });
    movie = await Newmovie.save();}
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/city", async (req, res) => {
  city = await City.find();
  try {
    res.status(200).json(city); 
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/movie", async ({body}, res) => {
  const city=body;
  movie = await Movie.find({city:city});
  try {
    res.status(200).json(movie); 
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/getShowByTheatre", async (req, res) => {
  const {theatreId, date } = req.body;
  const shows =await Show.find({ theatreId: theatreId, date: date });
  try {
    res.status(200).json(shows);      
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/getShowsByMovie", async (req, res) => {
  const {movieId, date } = req.body;
  const shows =await Show.find({ movieId: movieId, date: date });
  try {
    res.status(200).json(shows);      
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/getAudi",async(req,res)=>{
  const audi=await Audi.findOne({audiId:audiId});
  if(audi){
    return res.status(200).json(audi)
  }
  return res.status(404).json("No such audi found!")
});
router.get("/reservation", async (req, res) => {
  const { noOfBookedSeats,  bookedSeats,showId} = req.body;
  seatidArray = [];
  const Newseat = await Show.findOne({ showId });
   const audiId=Newseat.theatreId+Newseat.audi;
   const seatLimit = await Audi.findOne({ audiId });
  try{
  if (Newseat.noOfBookedSeats===0) {
    for (var i = 0; i < noOfBookedSeats; i++) {
      seatidArray[i] =  bookedSeats[i];
    }
    const UpdatedShow = await Show.findByIdAndUpdate(
      { _id: Newseat._id },
      { $set: { bookedSeats: seatidArray, noOfBookedSeats: noOfBookedSeats } }
    );
    return res.status(200).json(UpdatedShow);
  }
    const newSeats = Newseat.noOfBookedSeats + noOfBookedSeats;
    for (var i = 0; i < Newseat.noOfBookedSeats; i++) {
      seatidArray[i] = Newseat.bookedSeats[i];
    }
    let j = 0;
    for (var i = Newseat.noOfBookedSeats; i < newSeats&&i<seatLimit.noOfseats; i++) {
      seatidArray[i] = bookedSeats[j];
      j++;
    }
    const UpdatedShow = await Show.findByIdAndUpdate(
      { _id: Newseat._id },
      { $set: { bookedSeats: seatidArray, noOfBookedSeats: newSeats } }
    );
    return res.status(200).json(UpdatedShow);
  }catch(error)
  {
    return res.status(500).json(error)
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
});module.exports = router;
