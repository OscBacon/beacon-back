
const { User } = require('./models/user')


var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
var attendingRouter = require('./routes/attending');
var authRouter = require('./routes/auth');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const cors = require('cors')
// express-session for managing user sessions
const session = require('express-session');

const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

let corsOptions = {
  origin: ['http://localhost:3000', 'https://beacon-f.herokuapp.com'],
  credentials: true
};

app.use(cors(corsOptions)); // to accept request from other ports
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
    expires: 1800000,
    httpOnly: true
  }
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Our own express middleware to check for
// an active user on the session cookie (indicating a logged in user.)
const validation = (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
    res.status(401).send();
  } else {
    next(); // next() moves on to the route.
  }
};

app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/attending', attendingRouter);
app.use('/users', authRouter);


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
