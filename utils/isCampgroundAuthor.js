const createError = require('http-errors');
const { Campground } = require('../models');

module.exports = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);

  if (!campground.author.equals(req.user._id)) {
    return next(createError(403, 'You do not have permission to do that.'));
  }

  next();
};
