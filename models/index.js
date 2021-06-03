module.exports.Campground = require('./campground');
module.exports.Review = require('./review');
module.exports.User = require('./user');

module.exports.reset = async () => {
  await module.exports.Review.deleteMany({ isSeed: false });
  await module.exports.Campground.deleteMany({ isSeed: false });
  await module.exports.User.deleteMany({ isSeed: false });
};
