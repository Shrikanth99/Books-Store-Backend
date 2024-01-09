const mongoose = require('mongoose')
const {Schema,model} = mongoose

const addressSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fullName: String,
    phoneNumber: Number,
    houseNumber: String,
    address: String,
    landMark: String,
    city: String,
    state: String,
    country: String,
    pincode: Number,
    location:{
        type:{
            type:String,
            required:true,
            default:'Point'
        },
        coordinates: {      
            required:true,
            type:[Number]       //geospatial data
        }
    }, 
    addressType:{
        type: String,
        enum: ['Home','Office'],
    },
    defaultAdd:{
        type: Boolean,
        default: false
    }

})

const Address = model('Address',addressSchema)
module.exports = Address