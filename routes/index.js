const createError = require('http-errors');

module.exports.notFound = (req, res, next) => {
  next(createError(404, 'The resource you requested could not be found.'));
};

module.exports.errorHandler = (err, req, res, next) => {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode);
    res.render('error', { err });
  } else {
    console.error(err.stack || err.message);
    res.status(500);
    res.render('error', { err: createError(500, 'An unexpected server error occured.') });
  }
};

module.exports.campgrounds = require('./campgrounds');
module.exports.reviews = require('./reviews');
module.exports.root = require('./root');
