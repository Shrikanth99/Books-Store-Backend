const Review = require('../models/review-model')
const {validationResult} = require('express-validator')
const _ = require('lodash')
const reviewCltr = {}

reviewCltr.create = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['rating','review'])
    const review = new Review(body)
    review.userId = req.user.id
    review.product = req.params.id
    try{
        await review.save()
        res.json(review)
    }
    catch(e){
        return res.status(500).json(e)
    }
}

reviewCltr.list = async(req,res) =>{
    try{
        const {id} = req.params
        const reviews = await Review.find({product:id})
        res.json(reviews)
    }
    catch(e){
        res.status(500).json(e)
    }
}

reviewCltr.update = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {id} = req.params
    const {body} = req
    try{
        const review = await Review.findByIdAndUpdate(id,body,{new:true})
        res.json(review)
    }
    catch(e){
        res.status(500).json(e)
    }
}

reviewCltr.delete = async(req,res) =>{
    const {pId,rId} = req.params
    try{
        const review = await Review.findOneAndDelete({ _id: id ,product:pId})
        res.json(review)
    }
    catch(e){
        return res.status(500).json(e)
    }
}

module.exports = reviewCltr