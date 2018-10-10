const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas')

//Ideas listing
router.get('/', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(Ideas => {
      res.render('ideas/index', {
        Ideas
      })
    })

})

//Add Ideas
router.get('/add', (req, res) => {
  pageTitle = 'Add Ideas Page'
  res.render('ideas/add', {
    title: pageTitle
  });
})
//Edit Ideas
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', { idea });
  })

})

//Process From
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" })
  }
  if (!req.body.details) {
    errors.push({ text: "Please add a details" })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else {
    let newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser).save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      })

  }

})

//Edit of Ideas 
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    })
  });
})

//Delete of Ideas
router.delete('/:id', (req, res) => {
  
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video idea removed');  
    res.redirect('/ideas');
  });
})


module.exports = router;