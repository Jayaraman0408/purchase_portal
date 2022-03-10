const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// API to registration setup
exports.signup = (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
    })
};

// API to login 
exports.signin = (req, res) => {
    User.findOne({
      username: req.body.username
    })
    .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
          res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token
          });
    })
}
// API to getUsers 
exports.getUsers = (req,res)=>{
  User.find().exec(function (err, userDetails) {
    if(err){
      res.status(500).send({ message: err });
      return;
    }else{
      res.send({data: userDetails});
    }
  })
}