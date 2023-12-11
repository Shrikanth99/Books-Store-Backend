const mongoose = require('mongoose')
const { Schema, model } = mongoose

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    status:{
        type: String,
        enum:["Not Process", "Processing","Shipped","Delivered","Cancel"]
    }

})

const Order = model('Order', orderSchema)
module.exports = Order