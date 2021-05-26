const express = require('express');
const { Campground, Review } = require('../models');
const routeHandlerAsync = require('../utils/routeHandlerAsync');
const validate = require('../utils/validate');

const router = express.Router();

router.get('/', routeHandlerAsync(async (req, res, next) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/new', validate('campground'), routeHandlerAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', { campground });
}));

router.delete('/:id', routeHandlerAsync(async (req, res, next) => {
  console.log('hit')
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
}));

router.get('/:id/edit', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

router.put('/:id/edit', validate('campground'), routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
  res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;
