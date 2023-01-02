const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Class: {
    type: String,
    required: true,
  },
  Phonenumber: {
    type: Number,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  // id_is: {
  //   type: String,
  //   required: true,
  // },
  
  Email: {
    type: String,
    required: true,
  },
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});



const User = mongoose.model("API", userSchema);
module.exports = User;
