const Events = require('../../api/v1/events/model');
const { checkingImage } = require('./images');
const { checkingCategories } = require('./categories');
const { checkingTalents } = require('./talents');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;
  let condition = { organizer: req.user.organizer };

  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: 'i' }};
  }
  if (category) {
    condition = { ...condition, category };
  }
  if (talent) {
    condition = { ...condition, talent };
  }

  const result = await Events.find(condition)
    .populate({
      path: 'image',
      select: '_id name',
    })
    .populate({
      path: 'category',
      select: '_id name',
    })
    .populate({
      path: 'talent',
      select: '_id name role image',
      populate: {
        path: 'image',
        select: '_id name',
      },
    });

  return result;
};

const createEvents = async (req) => {
  const {
    title,
    about,
    date,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  // cari image, category dan talent dengan field id
  await checkingImage(image);
  await checkingCategories(category);
  await checkingTalents(talent);
  
  // cari event dengan field name
  const check = await Events.findOne({ title });
  
  if (check) throw new BadRequestError('Judul acara sudah terdaftar');

  const result = await Events.create({
    title,
    about,
    date,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
    organizer: req.user.organizer
  });

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({ _id: id, organizer: req.user.organizer })
  .populate({
    path: 'image',
    select: '_id name',
  })
  .populate({
    path: 'category',
    select: '_id name',
  })
  .populate({
    path: 'talent',
    select: '_id name role image',
    populate: {
      path: 'image',
      select: '_id name',
    },
  });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id ${id}`);

  return result;
};

const updateEvents = async (req) => {
  const { id } = req.params;
  const {
    title,
    about,
    date,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  // cari image, category dan talent dengan field id
  await checkingImage(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  // tambahan pengecekana apakah id benar atau tidak
  // kalau di cek di chek findOne $ne mah id salah gak ke check nya jadi ada isinya
  const checkIdEvent = await Events.findOne({ _id: id });
  if (!checkIdEvent) throw new NotFoundError(`Tidak ada acara dengan id: ${id}`);

  // cari event dengan field name
  const check = await Events.findOne({
    title,
    organizer: req.user.organizer,
    _id: { $ne: id }
  });

  console.log(check);
  if (check) throw new BadRequestError('Judul acara sudah terdaftar');

  const result = await Events.findOneAndUpdate(
    {_id: id, organizer: req.user.organizer },
    {
      title,
      about,
      date,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent,
    },
    { new: true, runValidators: true },
  );

  return result;
};

const deleteEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOneAndDelete({ _id: id, organizer: req.user.organizer });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);

  return result;
};

const changeStatusEvents = async (req) => {
  const { id } = req.params;
  const { statusEvent } = req.body;

  const checkEvent = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  if (!checkEvent) {
    throw new NotFoundError(`Tidak ada event dengan id ${id}`);
  }

  checkEvent.statusEvent = statusEvent;

  await checkEvent.save();
  return checkEvent;
};

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvent,
  updateEvents,
  deleteEvents,
  changeStatusEvents,
};
