const express = require('express');
const controller = require('../controllers/campgrounds');
const { isAuthenticated, isCampgroundAuthor, validate, routeHandlerAsync } = require('../utils');

const router = express.Router();

router.route('/')
  .get(routeHandlerAsync(controller.getIndex))
  .post(isAuthenticated, validate('campground'), routeHandlerAsync(controller.postNew));

router.route('/new')
  .get(isAuthenticated, controller.getNew);

router.route('/:id')
  .get(routeHandlerAsync(controller.getCampground))
  .put(isAuthenticated, isCampgroundAuthor, validate('campground'), routeHandlerAsync(controller.putCampground))
  .delete(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.deleteCampground));

router.route('/:id/edit')
  .get(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.getCampgroundEdit));

module.exports = router;
