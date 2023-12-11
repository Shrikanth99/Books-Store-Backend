const mongoose = require('mongoose')
const {model,Schema} = mongoose

const reviewSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    rating: Number,
    review: String
},{timestamps:true})

const Review = model('Review',reviewSchema)
module.exports = Review