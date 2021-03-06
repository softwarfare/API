var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib = require('nib');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./helpers/config');
var feed = require('./routes/feed');

var app = express();

function compile(str, path){
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('superSecret', config.secret);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(stylus.middleware(
  {
    src: __dirname + 'public'
    , compile: compile
  }
))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/api/v1/users', users);
app.use('/api/v1/feed', feed);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', err);
});

mongoose.connect('mongodb://localhost:/testdb');
var db = mongoose.connection;
db.once('open', function(){
  console.log('db connected');
});

module.exports = app;
