const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const _ = require('lodash')
const {uploadToS3} = require('../middlewares/image-upload')
const Product = require('../models/product-model')
const Category = require('../models/category-model')


productCltr = {}

productCltr.list = async(req,res) => {
    const {search,categoryId,sort} = req.query
    console.log('search',search,'cat',categoryId,'sort',sort)
    try {
        let matchCriteria ={}
        if(search){
            matchCriteria = {
                $or : [
                    {title:{$regex:search, $options: 'i'}},
                    {author:{$regex:search, $options: 'i'}}
                ]
            }
        }
        if(categoryId){
            matchCriteria.categoryId = new mongoose.Types.ObjectId(categoryId)
        }
        
        const aggregationPipeline = []

        if (Object.keys(matchCriteria).length !== 0) {
            aggregationPipeline.push({ $match: matchCriteria });
        }

        if (sort) {
            let sortCriteria = {};
      
            switch (sort) {
              case "lowest-highest":
                sortCriteria = { price: 1 };
                break;
              case "highest-lowest":
                sortCriteria = { price: -1 };
                break;
              case "a-z":
                console.log('a-z')
                sortCriteria = { title: 1 };
                break;
              case "z-a":
                sortCriteria = { title: -1 };
                break;
              default:
                sortCriteria = { title: 1 }; // Default to sorting by title asc
                break;
            }
      
            aggregationPipeline.push({ $sort: sortCriteria });
        }
        //console.log('aP',aggregationPipeline)
        if(aggregationPipeline.length > 0){
            const products = await Product.aggregate(aggregationPipeline )
            console.log('q',products)
            res.json(products)
        }else  {
            const result = await Product.find()
            //console.log('res',result.length)
            res.json(result)
        }

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



/*
try {
        if(search && categoryId){
            if(sort){
                const products = await Product 
            }
            const products = await Product.find({$or:[{title:{$regex:search,$options:'i'}},{author:{$regex:search,$options:'i'}}], categoryId:categoryId})
            res.json(products)
        }
        else if(search){
            const products = await Product.find({$or:[{title:{$regex:search,$options:'i'}},{author:{$regex:search,$options:'i'}}]})
            res.json(products)
        }
        else{
            const products = await Product.find()
            res.json(products)
        }
    } catch (e) {
        res.status(500).json(e)
    }
*/