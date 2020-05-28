const db = require("../models");
const User = db.User;

const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

users.use(cors())

process.env.SECRET_KEY = 'secret'


// Register user
exports.register = (req, res) => {
  // Create a User
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        const hash = bcrypt.hashSync(userData.password, 10)
        userData.password = hash
        User.create(userData)
          .then(user => {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({ error: 'User already exists.' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

// Login user
exports.login = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({ token: token })
      } else {
        res.send('User does not exist.')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

// Profile user
 exports.profile = (req, res) => {
   var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

   User.findOne({
     where: {
       id: decoded.id
     }
   })
   .then(user => {
     if(user){
       res.json(user)
     }else{
       res.send('User does not exist.')
     }
   })
   .catch(err => {
     res.send('error: ' +err)
   })
 }

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.findAll({ where: { username: req.body.username } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};