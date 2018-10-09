const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

const port = 5000;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
  useNewUrlParser:true
})
.then(()=> { console.log('Mongo DB connected'); })
.catch( err => console.log(err));

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//Handlebar middleware
app.engine("handlebars", exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Index route
app.get('/', (req, res) => {
  pageTitle = "Home Page";
  res.render('index',{
    title:pageTitle
  });
})

//about route
app.get('/about', (req, res) => {
  pageTitle = 'about us'
  res.render('about',{
    title:pageTitle
  });
})

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

