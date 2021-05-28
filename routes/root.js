const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const { routeHandlerAsync } = require('../utils');
const validate = require('../utils/validate');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/campgrounds');
});

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }

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
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }

  res.render('users/login');
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    const url = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(url);
  }
);

router.get('/logout', (req, res) => {
  if (req.user) {
    req.flash('success', 'Successfully logged out.');
  }

  req.logout();
  const url = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(url);
});

module.exports = router;
