const Cart = require('../models/cart-model.js')
const _ = require('lodash')
const cartCltr = {}


cartCltr.create = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
        if(cart) {
            const existingProductIndex = cart.products.findIndex((product) => {
               return product.productId == req.params.id
 
            })

            if (existingProductIndex != -1) {
                cart.products[existingProductIndex].quantity += 1
            }   
            else {
                cart.products.push({ productId: req.params.id, quantity: 1 })
            }
            await cart.save()
            const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
            res.json(response)
        }
        else {
            const cartItem = {
                userId: req.user.id,
                products: [
                    {
                        productId: req.params.id,
                        quantity: 1
                    }
                ]
            }
            const newCart = new Cart(cartItem)
             await newCart.save()
            const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
            // console.log(response)
            res.json(response)
        }

    }
    catch (e) {
        console.log(e.message)
        res.status(500).json(e.message)
    }
}

cartCltr.list = async(req,res) =>{
    try{
        const cart = await Cart.findOne({userId: req.user.id}).populate('products.productId')
        //console.log(cart)
        if(cart){
            res.json(_.pick(cart,['products']))
        }
        else{
            res.json([])
        }
        
    }
    catch(e){
        res.status(500).json(e.message)
    }
}

cartCltr.removeQuantity = async(req,res) =>{
    try{
        const cart = await Cart.findOne({ userId: req.user.id })
        if(cart){
            const existingProductIndex = cart.products.findIndex(product=>{
                return product.productId == req.params.id
            })
            if(existingProductIndex != -1){
                if(cart.products[existingProductIndex].quantity == 1 && cart.products.length > 1){
                    cart.products.splice(existingProductIndex,1)
                    await cart.save()
                    const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
                    res.json(response)
                }
                else if(cart.products[existingProductIndex].quantity == 1 && cart.products.length == 1){
                    const cartItem = await Cart.findOneAndDelete({userId:req.user.id})
                    const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
                    res.json(response)
                }
                else{
                    cart.products[existingProductIndex].quantity -= 1
                    await cart.save()
                    const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
                    res.json(response)
                }
            }
            else{
                res.status(204).json('product not found')
            }
        }
      
    }
    catch(e){
        res.status(500).json(e)
    }
}

cartCltr.removeItem = async(req,res) =>{
    try{

        // const removeItem = await Cart.findOneAndUpdate({userId:req.user.id},{$pull:{products:}},{new:true})
        const cart = await Cart.findOne({ userId: req.user.id })
        if(cart){
            const removeItem = cart.products.filter(product=>{
                return product.productId != req.params.id
            })
            if(_.isEmpty(removeItem)){
                const cartItem = await Cart.findOneAndDelete({userId:req.user.id})
                res.json(cartItem)
            }
            else{   
                cart.products = removeItem
                const cartItem = await Cart.findOneAndUpdate({userId:req.user.id},cart,{new:true})
                res.json(cartItem)
            }
        }
    }
    catch(e){
        res.status(500).json(e)
    }
}

cartCltr.removeAll = async(req,res) =>{
    try{
        const cart = await Cart.findOneAndDelete({userId:req.user.id})
        res.json(cart)
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = cartCltr