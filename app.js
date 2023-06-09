const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const categoriesRouter = require('./app/api/v1/categories/router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use router
const v1 = '/api/v1/cms';
app.use(v1, categoriesRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    message: 'Welcom to API Semina',
  })
});

module.exports = app;
