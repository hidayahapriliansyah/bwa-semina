const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: '1m',
  jwtRefreshExpiration: '24h',
  jwtSecret: 'jwtSecret',
  jwtRefreshSecret: 'jwtRefreshSecret',
  gmail: 'patungancourse@gmail.com',
  password: 'aswniazeridvsbla',
};
