const mongoose = require('mongoose')
const {Schema, model} = mongoose

const userSchema = new Schema({
    userName : String,
    email : String,
    password : String,
    phoneNumber : Number,
    role : {
        type : String,
        enum : ['admin','moderator','user'],
        default : 'user'
    }
},{timestamps:true})

const User = model('User', userSchema)

module.exports = User