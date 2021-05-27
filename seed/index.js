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

  const user = new User({ username: 'test', email: 'test@test.com' });
  User.register(user, 'test', (err) => {
    if (err) throw err;
  });

  await seedCampgrounds(user);

  console.log('Finished seeding.');
  db.close();
};

async function seedCampgrounds(user) {
  for (let i = 0; i < 50; i++) {
    const city = cities.random();

    const camp = new Campground({
      title: `${descriptors.random()} ${places.random()}`,
      description: `${faker.lorem.paragraph()}`,
      image: 'https://source.unsplash.com/collection/483251',
      price: (Math.random() * 200).toFixed(2),
      location: `${city.city}, ${city.state}`,
      author: user,
      reviews: await seedReviews()
    });

    await camp.save();
  }
}

async function seedReviews() {
  const result = [];

  for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
    const review = new Review({
      rating: Math.ceil(Math.random() * 5),
      text: faker.lorem.paragraphs()
    });

    const document = await review.save();
    result.push(document);
  }

  return result;
}
