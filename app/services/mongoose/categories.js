const Categories = require('../../api/v1/categories/model');
const { BadRequestError } = require('../../errors');

const getAllCategories = async () => {
  const result = await Categories.find().select('_id name');

  return result;
};

const createCategories = async (req) => {
  const { name } = req.body;

  // pengecekan category
  const check = await Categories.findOne({ name });
  if (check) throw new BadRequestError('Kategori nama duplikat');

  const result = await Categories.create({ name });

  return result;
};

const getOneCategories = async (req, res) => {
  const { id } = req.params;

  const result = await Categories.findOne({ _id: id }).select('_id name');
  
  if (!result) {
    return res.status(404).json({
      message: `Tidak id kategori dengan id : ${id}`,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategories,
};
