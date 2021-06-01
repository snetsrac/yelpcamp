const createHttpError = require('http-errors');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { Campground } = require('../models');

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

const getGeometry = async (location) => {
  try {
    const geocodingResponse = await geocodingClient.forwardGeocode({
      query: location,
      limit: 1
    }).send();

    return geocodingResponse.body.features[0].geometry;
  } catch (err) {
    throw createHttpError(400, `A location named '${location}' could not be found.`);
  }
}

module.exports.getIndex = async (req, res, next) => {
  const campgrounds = await Campground.find().populate('author');
  res.render('campgrounds/index', { campgrounds });
};

module.exports.getNew = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.postNew = async (req, res, next) => {
  
  const campground = new Campground(req.body.campground);
  campground.author = req.user;
  campground.geometry = await getGeometry(req.body.campground.location);
  campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  await campground.save();
  req.flash('success', `Campground '${campground.title}' was successfully added.`);
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.getCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');

  if (!campground) {
    req.flash('error', 'Could not find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/show', { campground });
};

module.exports.getCampgroundEdit = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
};

module.exports.putCampground = async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
  campground.geometry = await getGeometry(req.body.campground.location);

  const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.images.push(...images);
  await campground.save();

  const imagesToDelete = req.body.imagesToDelete || [];

  if (imagesToDelete.length >= campground.images.length) {
    return next(createHttpError(400, 'Cannot delete all images for a campground, at least one must remain.'));
  } else {
    campground.images = campground.images.filter((image) => !imagesToDelete.includes(image.filename));
    await campground.save();
  }

  req.flash('success', `Successfully updated '${campground.title}'.`);
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', `Successfully deleted '${campground.title}'.`);
  res.redirect('/campgrounds');
};
