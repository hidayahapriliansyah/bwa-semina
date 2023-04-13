const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: '7d',
  jwtSecret: 'jwtSecret',
  gmail: 'patungancourse@gmail.com',
  password: 'aswniazeridvsbla',
};
