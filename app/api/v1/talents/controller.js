const { StatusCodes } = require('http-status-codes');
const {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
} = require('../../../services/mongoose/talents');

const create = async (req, res, next) => {
  try {
    const result = await createTalents(req);
  
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// get all cateogries
const index = async (req, res, next) => {
  try {
    const result = await getAllTalents(req);
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
    const result = await getOneTalents(req);

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
    const result = await updateTalents(req);

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
    const result = await deleteTalents(req);
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
