const express = require('express');
const controller = require('../controllers/campgrounds');
const {isAuthenticated, isCampgroundAuthor, validate, routeHandlerAsync, upload } = require('../middleware');

const router = express.Router();

router.route('/')
  .get(routeHandlerAsync(controller.getIndex))
  .post(isAuthenticated, upload.array('images'), validate('campground'), routeHandlerAsync(controller.postNew));

router.route('/new')
  .get(isAuthenticated, controller.getNew);

router.route('/:id')
  .get(routeHandlerAsync(controller.getCampground))
  .put(isAuthenticated, isCampgroundAuthor, upload.array('images'),
    validate('campground'), routeHandlerAsync(controller.putCampground))
  .delete(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.deleteCampground));

router.route('/:id/edit')
  .get(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.getCampgroundEdit));

module.exports = router;
