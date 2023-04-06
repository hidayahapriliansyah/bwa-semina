const Talents = require('../../api/v1/talents/model');
const { checkingImage } = require('./images');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllTalents = async (req) => {
  const { keyword } = req.query;

  let condition = {};

  // condition digunakan untuk filter kayaknya deh xexexe
  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $option: 'i' } };
  }

  const result = await Talents.find(condition)
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id name role image')
  
    return result;
};

const createTalents = async (req) => {
  const { name, role, image } = req.body;

  // cari image dengan field image
  await checkingImage(image);

  // cari talent dengan field name
  const check = await Talents.findOne({ name });

  // apabila check true / data talent sudah ada, maka tampilkan error bad request dengan message pembicara sudah terdaftar
  if (check) throw new BadRequestError('Pembicara sudah terdaftar');

  const result = await Talents.create({ name, role, image });

  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({ _id: id })
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id name role image');

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

  return result;
};

const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, role, image } = req.body;

  // cari image dengan field image
  await checkingImage(image);

  // cara talent bedasarkan name dan id selain id yang sama (ini supaya kalau update dengan data sama gak dianggap duplikat)
  const check = await Talents.findOne({
    name,
    _id: { $ne: id },
  });

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, role, image },
    { new: true, }
  );

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);
  
  return result;
};

const deleteTalents = async (req) => {
  const { id } = req.params;
  
  // karena tadi di categories await result.remove() gak jalan, kita pake findOneAndRemove
  const result = await Talents.findOneAndRemove({ _id: id });
  
  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

  return result;
};

const checkingTalents = async (req) => {
  const { id } = req.params;
  const result = await Talents.findOne({ _id: id });
  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);
  return result;
};

module.exports = {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
};
