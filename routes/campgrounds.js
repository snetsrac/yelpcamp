const express = require('express');
const { Campground, Review } = require('../models');
const { isAuthenticated, isCampgroundAuthor, validate, routeHandlerAsync } = require('../utils');

const router = express.Router();

router.get('/', routeHandlerAsync(async (req, res, next) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isAuthenticated, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/new',
  isAuthenticated,
  validate('campground'),
  routeHandlerAsync(async (req, res, next) => {
    const campground = new Campground({ ...req.body.campground, author: req.user });
    await campground.save();
    req.flash('success', `Campground '${campground.title}' was successfully added.`);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get('/:id', routeHandlerAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');

  if (!campground) {
    req.flash('error', 'Could not find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit',
  isAuthenticated,
  isCampgroundAuthor,
  routeHandlerAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
    })
);

router.put('/:id',
  isAuthenticated,
  isCampgroundAuthor,
  validate('campground'),
  routeHandlerAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);

    req.flash('success', `Successfully updated '${campground.title}'.`);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete('/:id',
  isAuthenticated,
  isCampgroundAuthor,
  routeHandlerAsync(async (req, res, next) => {
    console.log('hit')
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Successfully deleted '${campground.title}'.`);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
