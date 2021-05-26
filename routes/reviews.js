const express = require('express');
const { Campground, Review } = require('../models');
const routeHandlerAsync = require('../utils/routeHandlerAsync');
const validate = require('../utils/validate');

const router = express.Router({ mergeParams: true });

router.post('/', validate('review'), routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  campground.reviews.pull(req.params.reviewId);
  await campground.save();
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/campgrounds/${ campground._id }`);
}));

module.exports = router;
