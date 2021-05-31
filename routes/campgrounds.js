const express = require('express');
const multer = require('multer');
const controller = require('../controllers/campgrounds');
const {isAuthenticated, isCampgroundAuthor, validate, routeHandlerAsync, storage } = require('../utils');

const router = express.Router();
const parser = multer({ storage: storage });

router.route('/')
  .get(routeHandlerAsync(controller.getIndex))
  .post(isAuthenticated, parser.array('images'), validate('campground'), routeHandlerAsync(controller.postNew));

router.route('/new')
  .get(isAuthenticated, controller.getNew);

router.route('/:id')
  .get(routeHandlerAsync(controller.getCampground))
  .put(isAuthenticated, isCampgroundAuthor, parser.array('images'),
    validate('campground'), routeHandlerAsync(controller.putCampground))
  .delete(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.deleteCampground));

router.route('/:id/edit')
  .get(isAuthenticated, isCampgroundAuthor, routeHandlerAsync(controller.getCampgroundEdit));

module.exports = router;
