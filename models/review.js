const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  text: String,
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
