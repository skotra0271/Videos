const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/user');
const User = mongoose.model('users')


//user login
router.get('/login', (req, res) => {
  res.render('users/login');
})

//user Register
router.get('/register', (req, res) => {
  res.render('users/register');
})

//login Form Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

});

//Register form post
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Passwords must be at least 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.fristname,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })

  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already exist');
          res.redirect('/users/login');
        }
        else {
          let newUser = new User({
            name: req.body.fristname,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash;
              newUser.save()
                .then(idea => {
                  req.flash('success_msg', 'New user  added');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                })
            })
          })
        }
      })



  }

})

router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg', 'you are logged out')
  res.redirect('/users/login');
})

module.exports = router;