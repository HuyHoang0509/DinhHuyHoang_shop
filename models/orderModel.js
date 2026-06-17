const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer Name is required'],
    trim: true
  },
  productName: {
    type: String,
    required: [true, 'Product Name is required']
  },
  quantity: {
    type: Number,
    default: 0
  },
  orderDate: {
    type: Date,
    required: [true, 'Order Date is required']
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
