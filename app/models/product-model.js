const mongoose = require('mongoose')
const {Schema ,model} = mongoose

const productSchema = new Schema({
    title : String,
    author : String,
    image : [{url:String,key:String,}],
    description : String,
    price : {
        type : Number,
        default : 0
    },
    categoryId : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
    },
    ratings : Number,
    stockCount : {
        type : Number,
        default : 0
    }
},{timestamps:true})

const Product = model('Product', productSchema )

module.exports = Product