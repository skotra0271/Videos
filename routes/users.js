const express = require('express');
const mongoose = require('mongoose');
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
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password:req.body.password,
      password2:req.body.password2
    }
    new User(newUser).save()
      .then(idea => {
        req.flash('success_msg', 'New user  added');
        res.redirect('/users/login');
      })

  }

})

module.exports = router;