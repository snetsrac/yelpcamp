const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Schema.Types.Decimal128,
  location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);
