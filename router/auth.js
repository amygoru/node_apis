const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {sign} = jwt;
const router = express.Router();
const User = require("../model/userSchema");
const bodyparser = require("body-parser");
const axios = require("axios");
const generator = require("generate-password");
const nodemailer = require("nodemailer");

require("../db/conn");

router.use(bodyparser.json());
// get all users data
router.get("/users", (req, res) => {
  User.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      console.log(err);
    });
  // res.send(`'Hellow world from the server Auth.js'`)
});

// serach by id
router.get("/sregister/:id", (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.sendStatus(404);
        res.send("Please enter valid id");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // res.send(`'Hellow world from the server Auth.js'`)
});

// delete by id
router.get("/register/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((register) => {
      res.send("book removed");
    })
    .catch((err) => {
      console.log(err);
    });
  // res.send(`'Hellow world from the server Auth.js'`)
});

// create new user (register)
router.post("/register", async (req, res) => {
  const registers = ({Name, Class, Phonenumber, Password, Email} = req.body);
  let ffsd = "";
  const jsontoken = sign({result: req.body}, "secret", {
    expiresIn: "1000000000000000000s",
  });

  let add_data = ({Name, Class, Phonenumber, Password, Email} = req.body);

  add_data.token = jsontoken;

  var rege = new User(add_data);
  await rege
    .save()
    .then((data) => {
      res.json(data);
      res.send("New user created");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/useremail", async (req, res) => {
  const {Email} = req.body;
  if (!Email) {
    return res.status(400).json({error: "Plaese enter name"});
  }
  const userLogin = await User.findOne({Email: Email});

  res.json({token: userLogin.token, id: userLogin._id, status: 1});
});

router.post("/login", async (req, resp) => {
  try {
    let token;
    const {Email, Password} = req.body;
    if (!Email) {
      return resp.status(400).json({error: "Plaese enter email"});
    }
    if (!Password) {
      return resp.status(400).json({error: "Plaese  enter password"});
    }
    const userLogin = await User.findOne({Email: Email});
    const upassword = await User.findOne({Password: Password});
    console.log(upassword.Password, "///////");
    console.log(Password, "???????????????????");
    if (!userLogin) {
      return resp.json({message: "User doesn't exist"});
    }
    if (Password !== upassword.Password) {
      return resp.json({message: "User or password doesn't exist"});
    }
    if (Email == userLogin.Email) {
      console.log("Email matched");
    }
    if (Password == upassword.Password) {
      console.log("Password matched");

      if (req.body.Email) {
        const json = {
          Email: req.body.Email,
        };
        const results = await axios.post(
          "http://localhost:5000/useremail",
          json
        );

        resp.json({
          _id: results.data.id,
          message: req.body.Email,
          token: results.data.token,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
// forgot password [send password by mail generated password]

router.post("/forgot_password_gernated", async (req, res) => {
  const {Email, _id} = req.body;
  if (!Email) {
    return res.status(400).json({error: "Plaese enter Email"});
  }
  if (!_id) {
    return res.status(400).json({error: "Plaese enter _id"});
  }
  const userLogin = await User.findOne({Email: Email});
  const useid = await User.findOne({_id: _id});

  if (userLogin.Email == Email) {
    var passwordff = generator.generate({
      length: 10,
      numbers: true,
    });
    // gernated password  send on database this same user
  }
  if (useid._id == _id) {
    const udata = await User.findByIdAndUpdate(
      {_id: useid._id},
      {
        $set: {
          Password: passwordff,
        },
      }
    );
    // Email

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "amit.primotech@gmail.com",
        pass: "qzauvcsnusepmlxt",
      },
    });

    var mailOptions = {
      from: "amit.primotech@gmail.com",
      to: `amit.primotech@gmail.com`,
      subject: "Password generated",
      text: `Dear ${userLogin.Name}
  your new password is  ${passwordff}
  `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  res.json({
    // Email: userLogin.Email,
    // status: 1,
    // is_data_matched: true,
    message: `Your Password has been generated. Please check your register mail id  ${userLogin.Email}`,
    // password: passwordff,
    // id:useid._id
  });
});

router.post("/forgot_password", async (req, res) => {
  const {Email} = req.body;
  if (!Email) {
    return res.status(400).json({error: "Plaese enter Email"});
  }
  const userLogin = await User.findOne({Email: Email});
  // Email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amit.primotech@gmail.com",
      pass: "qzauvcsnusepmlxt",
    },
  });

  var mailOptions = {
    from: "amit.primotech@gmail.com",
    to: `${userLogin.Email}`,
    subject: "Password generated",
    html: `<html><head></head><body><p>Dear ${userLogin.Name} </p> <br> click the link then change your password <br> Reset Password <a href="https://www.Passwordreset.com/?user_id=${userLogin._id}">www.amygoru.com</a>
      </body></html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.json({
    id: userLogin._id,
    message: `Please check your register mail id  ${userLogin.Email} Reset password link`,
  });
});

router.post("/reset_password", async (req, res) => {
  const {_id, Password} = req.body;
  if (!Password) {
    return res.status(400).json({error: "Plaese enter Password"});
  }
  if (!_id) {
    return res.status(400).json({error: "Plaese enter user id"});
  }

  // const data = await User.findOne({Password: Password});
  const useid = await User.findOne({_id: _id});

  if (useid._id == _id) {
    const udata = await User.findByIdAndUpdate(
      {_id: useid._id},
      {
        $set: {
          Password:Password ,
        },
      }
    );
  }
  // Email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amit.primotech@gmail.com",
      pass: "qzauvcsnusepmlxt",
    },
  });

  var mailOptions = {
    from: "amit.primotech@gmail.com",
    to: `${useid.Email}`,
    subject: "Password updated by MERN stack team (Amy_goru)",
    html: `<html><head></head><body><p>Dear ${useid.Name} </p> <br>  Your password updated  Please login this password <b>${useid.Password}</b>
      </body></html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.json({
    status:1,
    message: `Password updated`,
  });
});
module.exports = router;
