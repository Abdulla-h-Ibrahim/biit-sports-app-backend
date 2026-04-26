var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require("dotenv")
dotenv.config();

const authRoutes = require('./routes/authRoutes')
const testRoutes = require("./routes/testRoute")
const healthRoutes = require("./routes/healthRoute")

const userRoutes = require('./routes/model Routes/userRoutes');
const sportRoutes = require('./routes/model Routes/sportRoute');
const teamRoutes = require('./routes/model Routes/teamRoute');
const matchRoutes = require('./routes/model Routes/matchRoute');
const resultRoutes = require('./routes/model Routes/resultRoute');

var app = express();
const baseURL = '/biit/sports';

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(`${baseURL}/auth`, authRoutes)
app.use(`${baseURL}/test`, testRoutes)
app.use(`${baseURL}/health`, healthRoutes)

app.use(`${baseURL}/users`, userRoutes)
app.use(`${baseURL}/sport`, sportRoutes);
app.use(`${baseURL}/team`, teamRoutes);
app.use(`${baseURL}/match`, matchRoutes);
app.use(`${baseURL}/result`, resultRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
