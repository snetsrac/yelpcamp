const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//https://res.cloudinary.com/da8gaqzfc/image/upload/v1618156951/yelpcamp/pl30d8mrof0onoszyhlw.jpg

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_250');
});

const CampgroundSchema = new Schema({
  title: String,
  description: String,
  images: [ImageSchema],
  price: Schema.Types.Decimal128,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({ 
      _id: { $in: doc.reviews }
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
