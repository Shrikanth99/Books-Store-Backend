const mongoose = require('mongoose')
const { Schema, model } = mongoose

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address : {
        type:Schema.Types.ObjectId,
        ref : 'Address'
    },
    orderItem : [
        {
            product : {
                type : Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity : Number
        }
    ],
    totalAmount : Number,
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    orderStatus:{
        type: String,
        enum:[ "Pending","Delivered"],
        default:'Pending'
    },
    orderDate : Date,
    expectedDeliveryDate : Date
},{timestamps:true})

const Order = model('Order', orderSchema)
module.exports = Order