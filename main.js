require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const connectDB = require("./connnection");

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
  secret:'my Secret key',
  saveUninitialized:true,
  resave:false,
})
);

app.use((req,res,next) =>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("upload"));
// set template engine 
app.set('view engine','ejs');

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => console.log(`server strated at http://localhost:${PORT}`));
