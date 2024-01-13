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
      quantity: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['Credit Card']
  },
  transactionId: String,
  status: {
    type: String,
    default: 'Pending'
  },
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
