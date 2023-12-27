var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var cors = require('cors');
var bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

var conectionDB = require("./configs/mongoDB");

var employeesRouter = require('./routes/employees');
var clientRouter = require('./routes/client');
var propertyRouter = require('./routes/property');
var eventRouter = require('./routes/event');
var ticketRouter = require('./routes/ticket');

//API
var authRouterAPI = require('./Server/Routes/authAPI');
var propertyRouterAPI = require('./Server/Routes/propertyAPI');
var eventRouterAPI = require('./Server/Routes/eventAPI');
var ticketRouterAPI = require('./Server/Routes/ticketAPI');
var clientRouterAPI = require('./Server/Routes/clientAPI');
var cartRouterAPI = require('./Server/Routes/cartAPI');

var app = express();

// start mongoose
app.mongoose = mongoose;

// connect DataBase
conectionDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // Configure the body-parser middleware to handle JSON
app.use(
  cors({
    origin: 'http://localhost:4200', 
    credentials: true,
  })
);

// define the server routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api',employeesRouter);
app.use('/api', clientRouter);
app.use('/api',propertyRouter);
app.use('/api', eventRouter);
app.use('/api', ticketRouter);

//API
app.use('/api', authRouterAPI);
app.use('/api', propertyRouterAPI);
app.use('/api', eventRouterAPI);
app.use('/api', ticketRouterAPI);
app.use('/api', clientRouterAPI);
app.use('/api', cartRouterAPI);

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
