const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const port = 5000;

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
})
  .then(() => { console.log('Mongo DB connected'); })
  .catch(err => console.log(err));



//Handlebar middleware
app.engine("handlebars", exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//Method override middleware
app.use(methodOverride('_method'))

//Exrepss session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middle ware
app.use(flash());



//global variable
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

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

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

