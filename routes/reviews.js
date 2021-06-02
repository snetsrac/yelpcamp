const express = require('express');
const controller = require('../controllers/reviews');
const { isAuthenticated, isReviewAuthor, routeHandlerAsync, validate } = require('../middleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(controller.getIndex)
  .post(isAuthenticated, validate('review'), routeHandlerAsync(controller.postReview));

router.route('/:reviewId')
  .delete(isAuthenticated, isReviewAuthor, routeHandlerAsync(controller.deleteReview));

module.exports = router;
