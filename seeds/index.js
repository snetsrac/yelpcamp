const faker = require('faker');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places, cities }= require('./lists');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', () => { console.log('Database connected.'); });

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

const seedDb = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const city = cities.random();

    const camp = new Campground({
      title: `${descriptors.random()} ${places.random()}`,
      description: `${faker.lorem.sentence()}`,
      image: 'https://source.unsplash.com/collection/483251',
      price: Number(faker.commerce.price()),
      location: `${city.city}, ${city.state}`
    });

    await camp.save();
  }

  console.log('Finished seeding.');
  db.close();
};

seedDb();
