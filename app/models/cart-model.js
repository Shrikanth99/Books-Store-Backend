const mongoose = require('mongoose')
const {model,Schema} = mongoose

const cartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    products:[
        {
            productId:{
                type: Schema.Types.ObjectId,
                ref:'Product'
            },
            mode: String,
            quantity: Number
        }
    ]
})

const Cart = model('Cart',cartSchema)
module.exports = Cart