const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// router
const categoriesRouter = require('./app/api/v1/categories/router');

const app = express();
const v1 = '/api/v1/cms';

const notFoundMiddleware = require('./app/middleware/not-found');
const handlerErrorMiddleware = require('./app/middleware/handler-error');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', (req, res) => {
//   res.status(200).json({
//     message: 'Welcom to API Semina',
//   })
// });

app.use(v1, categoriesRouter);

app.use(notFoundMiddleware);
app.use(handlerErrorMiddleware);

module.exports = app;
