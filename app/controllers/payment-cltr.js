
const Payment = require("../models/payment-model")

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const paymentCltr = {}

paymentCltr.create = async(req,res) =>{
    const {products} = req.body
    console.log('ghj',products)
    // const lineItems = products.map(product=>({
    //     price_data: {
    //         currency: "inr",
    //         product_data:{
    //             name: product.productId.title
    //         },
    //         unit_amount: product.productId.price * 100,
    //     },
    //     quantity: product.quantity
    // }))
    try{

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: products.map(product=>({
                price_data: {
                    currency: "inr",
                    product_data:{
                        name: product.productId.title
                    },
                    unit_amount: product.productId.price * 100,
                },
                quantity: product.quantity
            })),
            mode: "payment",
            success_url: 'http://localhost:3000/' ,
            cancel_url: 'http://localhost:3000/'
        })
    
        const payment = new Payment()
        payment.products = products.map(ele=>{
            return (
                {
                   product:ele.productId._id,
                   quantity:ele.quantity
                }
            )
        })
        payment.user = req.user.id
        payment.transactionId = session.id
        await payment.save()
        res.json({id:session.id, url:session.url})
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = paymentCltr