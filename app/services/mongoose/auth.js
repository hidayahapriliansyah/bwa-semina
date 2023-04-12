const Users = require('../../api/v1/users/model');
const { createJWT, createTokenUser } = require('../../utils');
const { BadRequestError, UnauthorizedError } = require('../../errors');

const signin = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Users.findOne({ email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  
  const isPasswordCorrect = await result.comparePassword(password);
  
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJWT({ payload: createTokenUser(result) });

  return token;
};

module.exports = {
  signin,
};
