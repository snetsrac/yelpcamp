const express = require('express');
const passport = require('passport');
const querystring = require('querystring');
const { User } = require('../models');
const routeHandlerAsync = require('../utils/routeHandlerAsync');
const validate = require('../utils/validate');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', validate('user'), routeHandlerAsync(async (req, res, next) => {
  const user = new User({ username: req.body.username, email: req.body.email });

  User.register(user, req.body.password, (err, result) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }

    req.login(result, (err) => {
      if (err) return next(err);
    });

    req.flash('success', `Welcome to YelpCamp, ${result.username}!`);
    res.redirect('/campgrounds');
  });
}));

router.get('/login', (req, res) => {
  res.locals._dest = ''

  if (req.query._dest) {
    res.locals._dest = `?${querystring.stringify({ _dest: req.query._dest })}`;
  }
  
  res.render('users/login');
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    if (req.query._dest) {
      return res.redirect(req.query._dest);
    }

    res.redirect('/campgrounds');
  }
);

router.get('/logout', (req, res) => {
  if (req.user) {
    req.flash('success', 'Successfully logged out.');
  }

  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;
