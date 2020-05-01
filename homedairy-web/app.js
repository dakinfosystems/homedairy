var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("./lib/dotenv");

var app = express();

// Reader DB configuration
dotenv.read("./db.env");
// console.log(JSON.stringify(process.env, null, 4));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route for web request
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


/**
 * Sessioned routes below
 */
app.use("/rest", require("./routes/restapi"));

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
  res.render('index.pug', {
    title: "Error Page",
    page: 'error'
  });
});

module.exports = app;
