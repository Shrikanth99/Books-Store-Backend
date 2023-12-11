const mongoose = require('mongoose')
const {model,Schema} = mongoose

const wishlistSchema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref:'Product'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true})

const Wishlist = model('Wishlist',wishlistSchema)
module.exports = Wishlist