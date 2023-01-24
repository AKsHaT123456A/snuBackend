const router=require("express").Router();
const nodemailer = require("nodemailer");
const path =require("path");
const { createPDF } = require("../Services/createPdf");
const fs = require("fs");
const handlebars = require("handlebars");
router.post("/ticket",(req,res)=>{
    require("dotenv").config();

const nodemailer = require("nodemailer");
const { createPDF } = require("../Services/createPDF");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

let emailClient = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.emailserver,
    pass: process.env.password,
  },
});

const createHTMLToSend = (path, replacements) => {
  let html = fs.readFileSync(path, {
    encoding: "utf-8",
  });
  let template = handlebars.compile(html);

  let htmlToSend = template(replacements);

  return htmlToSend;
};

const sendPDF = async () => {
  const emailPath = path.resolve("./email-templates", "ticket.html");

  const replacements = {
    name: req.body.username,
    channel: req.body.movie,
  };

  let htmlToSend = createHTMLToSend(emailPath, replacements);
  let pdfOutput = await createPDF();

  try {
    emailClient.sendMail({
      from: `moviemozzocorporates@gmail.com`, // sender address
      to: req.body.email, // list of receivers
      subject: "Booking Ticket", // Subject line
      text:"Your movie is booked", // plain text body
      html: htmlToSend,
      attachments: [{ path: pdfOutput }],
    });
    res.status(200).json("Email sent");
  } catch (e) {
    console.log(e);
  }
};

sendPDF();
})
module.exports=router;

