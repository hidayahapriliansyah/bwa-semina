const Participants = require('../../api/v1/participants/model');
const { otpMail } = require('../mail');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../../errors');

const signupParticipant = async (req) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
  } = req.body;

  let result = await Participants.findOne({
    email,
    status: 'tidak aktif',
  });

  if (result) {
    // user yang sudah signup tapi belum konfirmasi email
    // malah signup lagi, jadi kita update data signupnya.
    result.firstName = firstName;
    result.lastName = lastName;
    result.email = email;
    result.password = password;
    result.role = role;
    result.otp = Math.floor(Math.random() * 9999);
  } else {
    // nah kalau result false, berarti dia belum pernah daftar.
    // kita buat baru
    result = await Participants.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    });
  };
  await otpMail(email, result);

  delete result._doc.password;
  return result;
};

const activateParticipant = async (req) => {
  const { otp, email } = req.body;
  const check = await Participants.findOne({ email });

  if (!check) throw new NotFoundError('Partisipant belum terdaftar');

  if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

  const result = await Participants.findByIdAndUpdate(check._id,
    { status: 'aktif' },
    { new: true },
  );

  delete result._doc.password;

  return result;
};

module.exports = {
  signupParticipant,
  activateParticipant,
};
