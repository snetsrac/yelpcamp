const path = require('path');
const engine = require('ejs-mate');
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const { session, helmet, setLocals, returnTo } = require('./middleware');
const { User } = require('./models');
const routes = require('./routes');

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(mongoSanitize());
app.use(helmet);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(returnTo);
app.use(setLocals);

app.use('/', routes.root);
app.use('/campgrounds', routes.campgrounds);
app.use('/campgrounds/:id/reviews', routes.reviews);
app.all('*', routes.notFound);

app.use(routes.errorHandler);

module.exports = app;
