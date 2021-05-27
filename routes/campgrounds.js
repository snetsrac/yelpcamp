const express = require('express');
const { Campground, Review } = require('../models');
const { isAuthenticated, routeHandlerAsync, validate } = require('../utils');

const router = express.Router();

router.get('/', routeHandlerAsync(async (req, res, next) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isAuthenticated, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/new', isAuthenticated, validate('campground'), routeHandlerAsync(async (req, res, next) => {
  const campground = new Campground({ ...req.body.campground, author: req.user._id });
  await campground.save();
  req.flash('success', `Campground '${campground.title}' was successfully added.`);
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');

  if (!campground) {
    req.flash('error', 'Could not find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/show', { campground });
}));

router.delete('/:id', isAuthenticated, routeHandlerAsync(async (req, res, next) => {
  console.log('hit')
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Deleted campground.');
  res.redirect('/campgrounds');
}));

router.get('/:id/edit', isAuthenticated, routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

router.put('/:id/edit', isAuthenticated, validate('campground'), routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
  req.flash('success', `Successfully updated '${campground.title}'.`);
  res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;
