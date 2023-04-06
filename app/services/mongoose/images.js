const Images = require('../../api/v1/images/model');

const createImage = async (req) => {
  const result = await Images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : 'uploads/avatar/default.jpg',
  });

  return result;
};

module.exports = {
  createImage,
};
