const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const users = require("../models/users");
const fs = require("fs");




// image upload 
var storage = multer.diskStorage({
   destination: function(req,file,cb){
      cb(null, "./upload");
   },
   filename:function(req,file,cb){
      cb(null,file.filename+"_"+Date.now()+"_"+file.originalname)
   },
});

var upload = multer({
   storage:storage,
}).single("image");

// insert an user into database route
router.post("/add", upload,(req,res)=>{
   const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
   });
   user.save().then(()=>{
      req.session.message ={
          type: 'success',
          message: 'user added succesfully!'
      };
      res.redirect('/');
  }).catch((err)=>{
      res.json({message: err.message, type:'danger'});
  });

});
// Get All users route 
// router.get("/",(req, res) =>{
//     User.find().exec((err,users) =>{
//       if(err){
//          res.json({message: err.message});
//       } else {
//          res.render("index",{
//             title:"Home Page",
//             users:users,
//          });
//       }
//    });
// });
router.get("/", async (req, res) => {
   try {
     // Use the correct model name (Place instead of place)
     const users = await User.find().exec();
 
     res.render('index', {
       title: 'Home Page',
       users: users
     });
   } catch (err) {
     res.json({
       message: err.message
     });
   }
 });

router.get("/add",(req,res) =>{
    res.render("add_users",{title:"Add users"});
 });
//  edit
router.get('/edit/:id', async (req, res) => {
   try {
       const id = req.params.id;
       const user = await User.findById(id);

       if (!user) {
           return res.redirect('/');
       }

       res.render('edit_users', {
           title: 'Edit User',
           user: user,
       });
   } catch (err) {
       console.error(err);
       res.redirect('/');
   }
});

// update user route 
router.post("/update/:id", upload, async (req, res) => {
   const id = req.params.id;
   let new_image = '';

   if (req.file) {
      new_image = req.file.filename;
      try {
         fs.unlinkSync("./upload/" + req.body.old_image);
      } catch (err) {
         console.log(err);
      }
   } else {
      new_image = req.body.old_image;
   }
   try {
      const updateData = {
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         image: new_image,
      };
      const result = await User.findByIdAndUpdate(id, updateData, { new: true });

      req.session.message = {
         type: "success",
         message: "User updated successfully!",
      };
      res.redirect("/");
   } catch (err) {
      res.json({ message: err.message, type: 'danger' });
   }
});

// Delete user route 
router.get("/delete/:id", async (req, res) => {
   const id = req.params.id;

   try {
      const result = await User.findByIdAndDelete(id);

      if (result && result.image) {
         try {
            fs.unlinkSync("./upload/" + result.image);
         } catch (err) {
            console.log(err);
         }
      }

      req.session.message = {
         type: "info",
         message: "User deleted successfully!"
      };
      res.redirect("/");
   } catch (err) {
      res.json({ message: err.message });
   }
});

module.exports = router;