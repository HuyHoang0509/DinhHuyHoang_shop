const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  stockStatus: {
    type: String,
    required: [true, 'Stock Status is required'],
    enum: ['in_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock',
    lowercase: true
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
