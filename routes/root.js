const express = require('express');
const passport = require('passport');
const controller = require('../controllers/root');
const { routeHandlerAsync } = require('../utils');
const validate = require('../utils/validate');

const router = express.Router();

router.route('/')
  .get(controller.getIndex);

router.route('/register')
  .get(controller.getRegister)
  .post(validate('user'), routeHandlerAsync(controller.postRegister));

router.route('/login')
  .get(controller.getLogin)
  .post(
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    controller.postLogin
  );

router.route('/logout')
  .get(controller.getLogout);

module.exports = router;
