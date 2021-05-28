const express = require('express');
const controller = require('../controllers/reviews');
const { isAuthenticated, isReviewAuthor, routeHandlerAsync, validate } = require('../utils');

const router = express.Router({ mergeParams: true });

router.get('/', controller.getIndex);

router.post('/',
  isAuthenticated,
  validate('review'),
  routeHandlerAsync(controller.postReview)
);

router.delete('/:reviewId',
  isAuthenticated,
  isReviewAuthor,
  routeHandlerAsync(controller.deleteReview)
);

module.exports = router;
