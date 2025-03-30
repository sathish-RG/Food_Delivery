const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant.menu'
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  deliveryAddress: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['preparing', 'on-the-way', 'delivered', 'cancelled'],
    default: 'preparing'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);