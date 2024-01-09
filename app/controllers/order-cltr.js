const _ = require('lodash')
const { validationResult } = require('express-validator')
const Order = require('../models/order-model')
const Product = require('../models/product-model')

const orderCltr = {}

orderCltr.create = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }

    const body = req.body
    try {
        const eD = (a) =>{
            let date = new Date()
            date.setHours(0,0,0,0)
            if(a){
                date.setDate(date.getDate() + 7);
            }
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();
    
        // Pad single-digit days or months with a leading zero
        const day = dd < 10 ? `0${dd}` : dd;
        const month = mm < 10 ? `0${mm}` : mm;
    
        const formattedDate = `${yyyy}-${month}-${day}`;
        return formattedDate
        }
    
        const order = new Order(body)
        order.user = req.user.id
        order.orderDate = eD()
        order.expectedDeliveryDate = eD(7)
        order.orderItem.forEach(async(ele) => {

            await Product.findOneAndUpdate({_id :ele.product },{$inc: {stockCount : -ele.quantity }})
        })
        const result = await order.save()
        res.json(result)
    } catch (e) {
        res.status(500).json(e)
    }
}

orderCltr.list = async(req,res) => {
    try {
        const order = await Order.find({user:req.user.id}).populate('orderItem.product').populate('payment',['status'])
        res.json(order)
    } catch (e) {
        res.status(500).json(e)
    }
}

orderCltr.listAll = async(req,res) => {
    try {
        const order = await Order.find().populate('orderItem.product')
        console.log('ao',order)
        res.json(order)
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports = orderCltr