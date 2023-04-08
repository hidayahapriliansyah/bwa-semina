const Categories = require('../../api/v1/categories/model');
const { BadRequestError, NotFoundError } = require('../../errors');

const getAllCategories = async (req) => {
  const result = await Categories.find({ organizer: req.user.organizer })
    .select('_id name');

  return result;
};

const createCategories = async (req) => {
  const { name } = req.body;

  // pengecekan category
  const check = await Categories.findOne({ name });
  if (check) throw new BadRequestError('Kategori nama duplikat');

  const result = await Categories.create({ name, organizer: req.user.organizer });

  return result;
};

const getOneCategories = async (req, res) => {
  const { id } = req.params;

  console.log(req.user);
  const result = await Categories.findOne({ _id: id, organizer: req.user.organizer }).select('_id name');
  
  if (!result) {
    return res.status(404).json({
      message: `Tidak id kategori dengan id : ${id}`,
    });
  }

  return result;
};

const updateCategories = async (req) => {
  const { id } = req.params;
  const { name } = req.body;

  // cari kategori dengan nama sesuai body selain id tersebut
  // skenario ini dibuat dengan tujuan agar ketika user mengupdate tapi dengan nama 
  // kategori yang sama maka kategori tidak dianggap duplikat
  const check = await Categories.findOne({ name, _id: { $ne: id }});
  // jika check true berarti terdapat duplikat, maka throw Error
  if (check) throw new BadRequestError('Kategori nama duplikat');

  const result = await Categories.findOneAndUpdate({ _id: id, organizer: req.user.organizer }, { name }, {
    new: true,
    runValidators: true,
  });

  // jika result null alias tidak update apapun, dipastikan id salah, maka akan menampilkan Error
  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);
  
  return result;
};

const deleteCategories = async (req) => {
  const { id } = req.params;

  const result = await Categories.findOneAndRemove({ _id: id, organizer: req.user.organizer });
  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);

  // await result.remove(); kok teu jalan? result.remove not function ceunah
  return result;
};

const checkingCategories = async (id) => {
  const result = await Categories.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);

  return result;
};

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkingCategories,
};
