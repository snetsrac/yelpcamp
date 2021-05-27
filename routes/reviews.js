const express = require('express');
const { Campground, Review } = require('../models');
const { isAuthenticated, routeHandlerAsync, validate } = require('../utils');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
  res.redirect(`/campgrounds/${req.params.id}`);
});

router.post('/', isAuthenticated, validate('review'), routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review.');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  campground.reviews.pull(req.params.reviewId);
  await campground.save();
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash('success', 'Deleted review.');
  res.redirect(`/campgrounds/${ campground._id }`);
}));

module.exports = router;
