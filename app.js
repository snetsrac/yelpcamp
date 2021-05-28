const path = require('path');
const engine = require('ejs-mate');
const express = require('express');
const createError = require('http-errors');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const { User } = require('./models');
const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', () => { console.log('Database connected.'); });

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash(), (req, res, next) => {
  if (!req.isAuthenticated() && !['/register', '/login'].includes(req.originalUrl) ) {
    req.session.returnTo = req.originalUrl;
  }

  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', routes.root);
app.use('/campgrounds', routes.campgrounds);
app.use('/campgrounds/:id/reviews', routes.reviews);

app.all('*', (req, res, next) => {
  next(createError(404, 'The resource you requested could not be found.'));
});

app.use((err, req, res, next) => {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode);
    res.render('error', { err });
  } else {
    console.error(err.stack || err.message);
    res.status(500);
    res.render('error', { err: createError(500, 'An unexpected server error occured.') });
  }
});

app.listen(3000, () => {
  console.log('Listening on 3000.');
});
