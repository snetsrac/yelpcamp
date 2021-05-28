const express = require('express');
const controller = require('../controllers/campgrounds');
const { isAuthenticated, isCampgroundAuthor, validate, routeHandlerAsync } = require('../utils');

const router = express.Router();

router.get('/',
  routeHandlerAsync(controller.getIndex)
);

router.get('/new',
  isAuthenticated,
  controller.getNew
);

router.post('/new',
  isAuthenticated,
  validate('campground'),
  routeHandlerAsync(controller.postNew)
);

router.get('/:id',
  routeHandlerAsync(controller.getCampground)
);

router.get('/:id/edit',
  isAuthenticated,
  isCampgroundAuthor,
  routeHandlerAsync(controller.getCampgroundEdit)
);

router.put('/:id',
  isAuthenticated,
  isCampgroundAuthor,
  validate('campground'),
  routeHandlerAsync(controller.putCampground)
);

router.delete('/:id',
  isAuthenticated,
  isCampgroundAuthor,
  routeHandlerAsync(controller.deleteCampground)
);

module.exports = router;
