const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const port = 5000;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
})
  .then(() => { console.log('Mongo DB connected'); })
  .catch(err => console.log(err));

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//Handlebar middleware
app.engine("handlebars", exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Index route
app.get('/', (req, res) => {
  pageTitle = "Home Page";
  res.render('index', {
    title: pageTitle
  });
})

//about route
app.get('/about', (req, res) => {
  pageTitle = 'about us'
  res.render('about', {
    title: pageTitle
  });
})
//Ideas listing
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(Ideas => {
      res.render('ideas/index', {
        Ideas
      })
    })

})

//Add Ideas
app.get('/ideas/add', (req, res) => {
  pageTitle = 'Add Ideas Page'
  res.render('ideas/add', {
    title: pageTitle
  });
})
//Edit Ideas
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', { idea });
  })

})

//Process From
app.post('/ideas', (req, res) => {
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
        res.redirect('/ideas');
      })

  }

})

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

