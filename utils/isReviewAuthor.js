const createError = require('http-errors');
const { Review } = require('../models');

module.exports = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review.author.equals(req.user._id)) {
    return next(createError(403, 'You do not have permission to do that.'));
  }

  next();
};
