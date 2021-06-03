const MongoStore = require('connect-mongo');
const session = require('express-session');

module.exports = session({
  name: '_yc',
  secret: process.env.SESSION_SECRETS.split(','),
  proxy: true,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 24 * 60 * 60
  })
});