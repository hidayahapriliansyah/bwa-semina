const jwt = require('jsonwebtoken');
const {
  jwtSecret,
  jwtExpiration,
  jwtRefreshSecret,
  jwtRefreshExpiration,
} = require('../config');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, jwtSecret);

const createRefreshJWT = ({ payload }) => {
  const token = jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: jwtRefreshExpiration,
  });

  return token;
};

const isTokenValidRefreshToken = ({ token }) => jwt.verify(token, jwtRefreshSecret);

module.exports = {
  createJWT,
  isTokenValid,
  createRefreshJWT,
  isTokenValidRefreshToken,
};
