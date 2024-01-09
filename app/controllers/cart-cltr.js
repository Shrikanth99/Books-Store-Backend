const Cart = require('../models/cart-model.js')
const Product = require('../models/product-model.js')
const _ = require('lodash')
const cartCltr = {}


cartCltr.create = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
        const product = await Product.findById(req.params.id)
        const {mode} = req.body
        if(cart) {
            const existingProductIndex = cart.products.findIndex((product) => {
               return product.productId == req.params.id && product.mode == mode
            })

            if (existingProductIndex != -1 && mode == 'buy') {
                if( cart.products[existingProductIndex].quantity < product.stockCount){
                    cart.products[existingProductIndex].quantity += 1
                }else {
                   return res.json({ msg : 'Product is Out of Quantity' })
                }
            }   
            else if(existingProductIndex != -1 && mode == 'sell'){
                cart.products[existingProductIndex].quantity += 1
            }
            else {
                cart.products.push({ productId: req.params.id,mode:mode, quantity: 1 })
            }
            await cart.save()
            const response = await Cart.findOne({userId: req.user.id}).populate('products.productId')
            res.json(response)
        }
        else {
            let cartItem
                cartItem = {
                    userId: req.user.id,
                    products: [
                        {
                            productId: req.params.id,
                            mode:mode,
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
        console.log('hola',e.message)
        res.status(500).json(e.message)
    }
}

cartCltr.list = async(req,res) =>{
    try{
        const cart = await Cart.findOne({userId: req.user.id}).populate('products.productId')
        //console.log(cart)
        if(cart){
            res.json(cart)
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
        const {mode} = req.query
        console.log(mode,'lav')
        if(cart){
            const existingProductIndex = cart.products.findIndex(product=>{
                return product.productId == req.params.id && product.mode == mode
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
        const {mode} = req.body
        if(cart){
            const removeItem = cart.products.filter(product=>{
                return product.productId != req.params.id && product.mode != mode
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
    //console.log('mode',req.query)
    const {mode} = req.query
    console.log('md',mode)
    try{
        const cart = await Cart.findOneAndUpdate({userId:req.user.id },{$pull:{products:{ mode : mode }}},{new:true})
        res.json(cart)
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = cartCltr