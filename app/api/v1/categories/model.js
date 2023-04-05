const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
    maxLength: [20, 'Panjang nama kategori maksimal 20 karakter']
  }
}, { timestamps: true });

module.exports = model('Category', categorySchema);
