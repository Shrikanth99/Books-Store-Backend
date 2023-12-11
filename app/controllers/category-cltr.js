const Category = require('../models/category-model')
const {validationResult} = require('express-validator')
const _ = require('lodash')

const categoryCltr = {}

categoryCltr.list = async(req,res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (e) {
        res.status(500).json(e)
    }
}

categoryCltr.create = async(req,res) => {
    const errors = validationResult(req)
    if( !errors.isEmpty() ){
        return res.status(400).json({errors : errors.array()})
    }
    const body = _.pick(req.body,['name'])
    try {
        const category = new Category(body)
        await category.save()
        res.json(category)
    } catch (e) {
        res.status(500).json(e)
    }
}

categoryCltr.destroy = async(req,res) => {
    const id = req.params.id
    try {
        const category = await Category.findOneAndDelete({ _id : id })
        res.json(category)
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports = categoryCltr