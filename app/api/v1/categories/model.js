const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
    maxLength: [20, 'Panjang nama kategori maksimal 20 karakter']
  },
  organizer: {
    type: mongoose.Types.ObjectId,
    ref: 'Organizer',
    required: true,
  },
}, { timestamps: true });

module.exports = model('Category', categorySchema);
