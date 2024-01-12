const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const procurementSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity : Number
        },
    ],
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address : {
        type:Schema.Types.ObjectId,
        ref : 'Address'
    },
    totalCost: Number, 
    procurementDate: {
        type: Date,
        default: Date.now,
    },
    status:{
        type:String,
        default: 'Pending',
        enum: ['Pending','Procured']
    }
}, { timestamps: true });

const Procurement = model('Procurement', procurementSchema);

module.exports = Procurement;
