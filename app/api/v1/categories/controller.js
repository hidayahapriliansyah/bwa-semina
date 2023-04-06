const { StatusCodes } = require('http-status-codes');

const {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories
} = require('../../../services/mongoose/categories');

const create = async (req, res, next) => {
  try {
    const result = await createCategories(req);
  
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// get all cateogries
const index = async (req, res, next) => {
  console.log('Index get ALl categories');
  try {
    const result = await getAllCategories();
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// find category by id
const find = async (req, res, next) => {
  try {
    const result = await getOneCategories(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// update category
const update = async (req, res, next) => {
  try {
    const result = await updateCategories(req);

    res.status(StatusCodes.OK).json({
      data: result,
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
    const result = await deleteCategories(req);
    res.status(StatusCodes.OK).json({
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
