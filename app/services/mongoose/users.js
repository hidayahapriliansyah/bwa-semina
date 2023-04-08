const Users = require('../../api/v1/users/model');
const Organizers = require('../../api/v1/organizers/model');
const { BadRequestError } = require('../../errors');

const createOrganizer = async (req) => {
  const { organizer, name, email, password, confirmPassword, role } = req.body; 

  if (password !== confirmPassword) {
    throw new BadRequestError('Password tidak sama dengan confirmPasword');
  }

  const result = await Organizers.create({ organizer });

  const user = await Users.create({
    name,
    email,
    password,
    role,
    organizer: result._id,
  });

  delete user._doc.password;

  return user;
};

module.exports = {
  createOrganizer,
};
