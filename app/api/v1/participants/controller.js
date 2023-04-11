const { StatusCodes } = require('http-status-codes');
const { signupParticipant, activateParticipant } = require('../../../services/mongoose/participants');

const signup = async (req, res, next) => {
  try {
    const result = await signupParticipant(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const activeParticipant = async (req, res, next) => {
  try {
    const result = await activateParticipant(req);

    res.status(StatusCodes.OK).json({
      data: { token: result },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  activeParticipant,
};
