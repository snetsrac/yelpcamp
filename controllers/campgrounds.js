const { Campground } = require('../models');

module.exports.getIndex = async (req, res, next) => {
  const campgrounds = await Campground.find().populate('author');
  res.render('campgrounds/index', { campgrounds });
};

module.exports.getNew = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.postNew = async (req, res, next) => {
  const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  const campground = new Campground({ ...req.body.campground, images, author: req.user });
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

  const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.images.push(...images);
  await campground.save();

  req.flash('success', `Successfully updated '${campground.title}'.`);
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', `Successfully deleted '${campground.title}'.`);
  res.redirect('/campgrounds');
};
