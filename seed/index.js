const faker = require('faker');
const mongoose = require('mongoose');
const { User, Campground, Review } = require('../models');
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

  for (let i = 0; i < 10; i++) {
    const profile = new User({ username: `test${i}`, email: `test${i}@test.com` });
    const user = await User.register(profile, `test${i}`);
    users.push(user);
  }

  return users;
}

async function seedCampgrounds(users) {
  for (let i = 0; i < 50; i++) {
    const city = cities.random();

    const camp = new Campground({
      title: `${descriptors.random()} ${places.random()}`,
      description: `${faker.lorem.paragraph()}`,
      image: 'https://source.unsplash.com/collection/483251',
      price: (Math.random() * 200).toFixed(2),
      location: `${city.city}, ${city.state}`,
      author: users.random(),
      reviews: await seedReviews(users)
    });

    await camp.save();
  }
}

async function seedReviews(users) {
  const result = [];

  for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
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
