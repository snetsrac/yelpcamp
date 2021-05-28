const express = require('express');
const passport = require('passport');
const controller = require('../controllers/root');
const { routeHandlerAsync } = require('../utils');
const validate = require('../utils/validate');

const router = express.Router();

router.get('/',
  controller.getIndex
);

router.get('/register',
  controller.getRegister
);

router.post('/register',
  validate('user'),
  routeHandlerAsync(controller.postRegister)
);

router.get('/login',
  controller.getLogin
);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  controller.postLogin
);

router.get('/logout',
  controller.getLogout
);

module.exports = router;
