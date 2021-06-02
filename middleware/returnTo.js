module.exports = (req, res, next) => {
  if (!['/register', '/login', '/logout'].includes(req.originalUrl) ) {
    req.session.returnTo = req.originalUrl;
  }

  next();
};
