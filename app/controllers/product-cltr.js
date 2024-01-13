const { validationResult } = require('express-validator')
const _ = require('lodash')
const {uploadToS3} = require('../middlewares/image-upload')
const Product = require('../models/product-model')
const Category = require('../models/category-model')

productCltr = {}

productCltr.list = async(req,res) => {
    try {
        const products = await Product.find()
        console.log('products',products)
        res.json(products)
    } catch (e) {
        res.status(500).json(e)
    }
}

productCltr.create = async(req,res) => {
    const errors = validationResult(req)
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors : errors.array() })
    }
    
    const body = _.pick(req.body, ['title', 'author', 'image', 'description', 'price' , 'categoryId', 'condition', 'ratings' , 'stockCount' ])
    const filesData = req.files //using multer for file upload
    //console.log(filesData)
    let images = []
    //uploading to AWS
    
    
    try {
        for(const file of filesData){
            const uploadResult = await uploadToS3(file)
            //console.log(uploadResult)
            images.push(uploadResult)
        }
        body.image = images
        const product = new Product(body)
        if(product.condition === 'Fair'){
            product.price = (product.price*50)/100
        }
        await product.save()
        res.json(product)
    } catch (e) {
        console.log(e.message)
        res.status(500).json(e.message)
    }
}

productCltr.update = async(req,res) =>{
    const errors = validationResult(req)
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors : errors.array() })
    }
    const {id} = req.params
    const body = _.pick(req.body,['stockCount'])
    try{
        const product = await Product.findByIdAndUpdate(id,body,{new:true})
        res.json(product)
    }
    catch(e){
        res.status(500).json(e)
    }

}

productCltr.delete = async(req,res) => {
    const id = req.params.id
    try {
        const product = await Product.findOneAndDelete({ _id : id })
        res.json(product)
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports = productCltr