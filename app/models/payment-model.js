const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Other']
  },
  transactionId: String,
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
