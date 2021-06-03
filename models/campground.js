const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_250');
});

const CampgroundSchema = new Schema({
  title: String,
  description: String,
  images: [ImageSchema],
  price: Schema.Types.Decimal128,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  isSeed: {
    type: Boolean,
    default: false
  }
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({ 
      _id: { $in: doc.reviews }
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
