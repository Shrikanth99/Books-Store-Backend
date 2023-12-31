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
    enum: ['Card']
  },
  transactionId: String,
  userEmail : String,
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
