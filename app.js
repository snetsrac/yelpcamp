const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', () => { console.log('Database connected.'); });

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/makecampground', async (req, res) => {
  const myCampground = new Campground({
    title: 'Dry Gulch',
    description: 'It\'s dry and gulchy.',
    price: 'A buck two-eighty fifty.',
    location: 'Tuba City, NM'
  });
  await myCampground.save();
  res.send(myCampground);
});

app.listen(3000, () => {
  console.log('Listening on 3000.');
});
