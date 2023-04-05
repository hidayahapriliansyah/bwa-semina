const Categories = require('./model');

const create = async (req, res, next) => {
  const { name } = req.body;

  const result = await Categories.create({ name });
  res.status(201).json({
    data: result,
  });
  try {
  } catch (err) {
    next(err);
  }
};

// get all cateogries
const index = async (req, res, next) => {
  try {
    const result = await Categories.find().select('_id name');
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// find category by id
const find = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await Categories.findOne({ _id: id }).select('_id name');
    
    if (!result) {
      return res.status(404).json({
        message: 'Id category tidak ditemukan',
      });
    }

    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// update category
const update = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  
  try {
    const updatedCategory = await Categories.findOneAndUpdate({ _id: id }, { name }, {
      new: true, runValidators: true,
    });
    res.status(200).json({
      data: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// delete category
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    // ini kalau id nya salah malah nge remove category pertama coy
    const result = await Categories.findOneAndRemove(id);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  create,
  find,
  update,
  destroy,
};
