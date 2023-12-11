const Procurement = require('../models/procurement-model')
const _ = require('lodash')

const procurementCltr = {}

procurementCltr.create = async(req,res) =>{
    const {sellerId} = req.params
    const body = _.pick(req.body,['products'])
    try{
        const totalCost = products.reduce((sum, product) => sum + product.price, 0);
        const newProcurement = new Procurement({
            products: body.products,
            buyer: req.user.id,
            seller: sellerId,
            totalCost
        })
        const savedProcurement = await newProcurement.save()
        res.json(savedProcurement)
    }
    catch(e){
        res.status(500).json(e)
    }
}