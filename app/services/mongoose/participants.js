const Participants = require('../../api/v1/participants/model');
const Events = require('../../api/v1/events/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');
const { otpMail } = require('../mail');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../../errors');
const { createJWT, createTokenParticipant } = require('../../utils/index');

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
  delete result._doc.otp;

  return result;
};

const signinParticipant = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Participants.findOne({ email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials')
  }

  if (result.status === 'tidak aktif') {
    throw new UnauthorizedError('Akun Anda belum aktif');
  }

  const isPasswordCorrect = await result.comparePassword(password);
  
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJWT({ payload: createTokenParticipant(result) });

  return token;
};

const getAllEvents = async (req) => {
  const result = await Events.find({ statusEvent: 'Published' })
    .populate('category')
    .populate('image')
    .select('_id title date tickets venueName');

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: req.params.id })
    .populate('category')
    .populate('talent')
    .populate('image');

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id: ${id}`);

  return result;
};

const getAllOrders = async (req) => {
  const result = await Orders.find({ participant: req.participant.id });
  return result;
};

const checkOutOrder = async (req) => {
  const { event, personalDetail, payment, tickets } = req.body;

  const checkingEvent = await Events.findOne({ _id: event });
  if (!checkingEvent) {
    throw new NotFoundError(`Tidak ada event dengan id : ${event}`);
  }
  
  const checkingPayment = await Payments.findOne({ _id: payment });
  if (!checkingPayment) {
    throw new NotFoundError(`Tidak ada pembayaran dengan id : ${payment}`);
  }
  
  let totalPay = 0;
  let totalOrderTicket = 0;
  await tickets.forEach((tic) => {
    checkingEvent.tickets.forEach((ticket) => {
      if (tic.ticketCategories.type === ticket.type) {
        if (tic.sumTicket > ticket.stock) {
          throw new NotFoundError('Stock event tidak mencukupi');
        } else {
          ticket.stock -= tic.sumTicket;

          totalOrderTicket += tic.sumTicket;
          totalPay += (tic.ticketCategories.price * ticket.sumTicket);
        }
      }
    });
  });

  await checkingEvent.save();

  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  };

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    ordertItem: tickets,
    participant: req.participant.id,
    event,
    historyEvent,
  });

  await result.save();
  return result;
};

module.exports = {
  signupParticipant,
  activateParticipant,
  signinParticipant,
  getAllEvents,
  getOneEvent,
  getAllOrders,
  checkOutOrder,
};
