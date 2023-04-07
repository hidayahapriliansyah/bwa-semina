const Events = require('../../api/v1/events/model');
const { checkingImage } = require('./images');
const { checkingCategories } = require('./categories');
const { checkingTalents } = require('./talents');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;
  let condition = {};

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
  });

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({ _id: id })
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

  // cari event dengan field name
  const check = await Events.findOne({ title, _id: { $ne: id } });

  if (check) throw new BadRequestError('Judul acara sudah terdaftar');

  const result = await Events.findOneAndUpdate(
    { _id: id },
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

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id: ${id}`);

  return result;
};

const deleteEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOneAndDelete({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);

  return result;
};

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvent,
  updateEvents,
  deleteEvents,
};
