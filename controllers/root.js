const { User } = require('../models');

module.exports.getIndex = (req, res) => {
  res.redirect('/campgrounds');
};

module.exports.getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }

  res.render('users/register');
};

module.exports.postRegister = async (req, res, next) => {
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
};

module.exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }

  res.render('users/login');
};

module.exports.postLogin = (req, res) => {
  const url = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(url);
};

module.exports.getLogout = (req, res) => {
  if (req.user) {
    req.flash('success', 'Successfully logged out.');
  }

  req.logout();
  const url = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(url);
};
