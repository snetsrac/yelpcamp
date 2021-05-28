const { Campground, Review } = require('../models');

module.exports.getIndex = (req, res) => {
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.postReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review({ ...req.body.review, author: req.user });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review.');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  campground.reviews.pull(req.params.reviewId);
  await campground.save();
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash('success', 'Deleted review.');
  res.redirect(`/campgrounds/${ campground._id }`);
};
