module.exports = app => {
    const userController = require("../controllers/user.controller.js");
    const passport = require('passport');
    const passportConfig = require('../oauth/passport');


    var router = require("express").Router();
  
    // User Register
    router.post("/register", userController.register);

    // User Login
    router.get("/login", userController.login);

    // User Profile
    //router.get("/profile", userController.profile);
  
    // Retrieve all User
    router.get("/", userController.findAll);

    router.get("/oauth/facebook", passport.authenticate('facebook'));
    
    router.get("/oauth/facebook/callback", passport.authenticate('facebook', { 
      successRedirect: '/login',
      failureRedirect: '/fail'
    }));

    router.get('/oauth/google', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }));

    router.get('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res){
      res.redirect('/');
    });

    // Express use of routes
    app.use('/api/users', router);
  };