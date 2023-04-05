const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api-error');

class NotFound extends CustomAPIError {
  constructor(message) {
    super(message);
    // memberikan statusCode bad request
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;
