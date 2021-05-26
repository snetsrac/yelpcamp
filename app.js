const path = require('path');
const engine = require('ejs-mate');
const express = require('express');
const createError = require('http-errors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');

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

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

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
