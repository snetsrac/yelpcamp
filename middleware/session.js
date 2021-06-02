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
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 60 * 60 * 24
  })
});