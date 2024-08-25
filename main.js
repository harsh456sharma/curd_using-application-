require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const connectDB = require("./connnection");

const app = express();
const PORT = process.env.PORT || 4000;

// data base connection 
// mongoose.connect(process.env.MONGO_URI);
// const db = mongoose.connection;
// db.on("error",(error) => console.log(error));
// db.once("open",() => console.log("connection to the database!"));
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
// app.get("/",(req,res) => {
//     res.send("harsh sharma");
// });

// app.listen(PORT, () => {
//   console.log(`server strated at http://localhost:${PORT}`);
// });
app.listen(PORT, () => console.log(`server strated at http://localhost:${PORT}`));