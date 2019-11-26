// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// express-session for managing user sessions
const session = require('express-session');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let eventsRouter = require('./routes/events');
let attendingRouter = require('./routes/attending');
let authRouter = require('./routes/auth');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'shhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60000,
    httpOnly: true
  }
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Our own express middleware to check for
// an active user on the session cookie (indicating a logged in user.)
const sessionValidation = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login'); // redirect to login if not logged in.
  } else {
    next(); // next() moves on to the route.
  }
};

app.use(sessionValidation);

app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/attending', attendingRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
