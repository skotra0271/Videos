const express = require('express');
const router = express.Router();

//user login
router.get('/login',(req,res)=>{
  res.render('users/login');
})

//user Register
router.get('/register',(req,res)=>{
  res.render('users/register');
})

module.exports = router;