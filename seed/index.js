const readline = require('readline');
const faker = require('faker');
const mongoose = require('mongoose');
const { User, Campground, Review } = require('../models');
const { descriptors, places, images, cities }= require('./lists');

const NUM_USERS = 10;
const NUM_CAMPGROUNDS = 500;
const MAX_PRICE = 200;
const MAX_IMAGES = 5;
const MAX_REVIEWS = 10;

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

seedDb();

async function seedDb() {
  await User.deleteMany();
  await Campground.deleteMany();

  const users = await seedUsers();
  await seedCampgrounds(users);

  console.log('Finished seeding.');
  db.close();
};

async function seedUsers() {
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const profile = new User({ username: `test${i}`, email: `test${i}@test.com` });
    const user = await User.register(profile, `test${i}`);
    users.push(user);

    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Seeded ${i + 1} users.`);
  }

  process.stdout.write('\n');

  return users;
}

async function seedCampgrounds(users) {
  for (let i = 0; i < NUM_CAMPGROUNDS; i++) {
    const city = cities.random();

    const campground = new Campground({
      title: `${descriptors.random()} ${places.random()}`,
      description: `${faker.lorem.paragraph()}`,
      images: seedImages(),
      price: (Math.random() * MAX_PRICE).toFixed(2),
      location: `${city.city}, ${city.state}`,
      geometry: {
        type: 'Point',
        coordinates: [city.longitude + randomOffset(), city.latitude + randomOffset()]
      },
      author: users.random(),
      reviews: await seedReviews(users)
    });

    await campground.save();

    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Seeded ${i + 1} campgrounds.`);
  }

  process.stdout.write('\n');
}

function seedImages() {
  const result = [];
  let num = Math.ceil(Math.random() * MAX_IMAGES);
  let i = num;

  while (num > 0) {
    result.push(images[i]);
    i++;
    if (i > images.length - 1) i = 0;
    num--;
  }

  return result;
}

function randomOffset() {
  const sign = Math.random() > 0.5 ? 1 : -1;
  return sign * Math.floor(Math.random() * 9) * 0.001;
}

async function seedReviews(users) {
  const result = [];

  for (let j = 0; j < Math.floor(Math.random() * MAX_REVIEWS); j++) {
    const review = new Review({
      rating: Math.ceil(Math.random() * 5),
      text: faker.lorem.paragraphs(),
      author: users.random()
    });

    const document = await review.save();
    result.push(document);
  }

  return result;
}
