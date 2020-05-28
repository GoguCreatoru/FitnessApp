const config = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const User = db.User;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, done) => {
    console.log(user.facebook_id);
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    // console.log(`id: ${id}`);
    User.findByPk(id)
      .then(user => {
        done(null, user);
      })
      .catch(error => {
        console.log(`Error: ${error}`);
      });
  });

passport.use(new FacebookStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret,
    callbackURL: 'https://localhost:8080/api/users/oauth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, function (accessToken, refreshToken, profile, done) {
        User.findOne({
            where: {
                facebook_id : profile.id
            }
        })
        .then(user => {
            if(user) {
                return done(null, user);
            }
            else {
                var newUser = {
                    facebook_id : profile.id,
                    facebook_token : accessToken,
                    facebook_name : profile.displayName,
                    email : profile.email
                }
                User.create(newUser)
                .then(createdUser => {
                    return done(null, createdUser);
                })
            }
        })
}))

passport.use(new GoogleStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: 'https://localhost:8080/api/users/oauth/google/callback',
    profileFields: ['id', 'email']
},  function (accessToken, refreshToken, profile, done) {
    User.findOne({
        where: {
            google_id : profile.id
        }
    })
    .then(user => {
        if(user) {
            return done(null, user);
        }
        else {
            var newUser = {
                google_id : profile.id,
                google_token : accessToken,
                google_name : profile.displayName,
                email : profile.email
            }
            User.create(newUser)
            .then(createdUser => {
                return done(null, createdUser);
            })
        }
    })
}))