const Payment = require('../models/payment-model')
const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const transporter = require('../../config/nodemailer')

const paymentCltr = {}

paymentCltr.create = async (req,res) => {
    const body = _.pick(req.body,['products','totalAmount','userEmail'])    
    try {
        const session = await stripe.checkout.sessions.create({

            payment_method_types : ['card'],
            mode : 'payment',
            line_items : body.products.map(product => {
                return {
                    price_data : {
                        currency : 'inr',
                        product_data : {
                            name : product.title
                        },
                        unit_amount : product.price * 100
                    },
                    quantity : product.quantity
                }
            }),
            success_url: "http://localhost:3000/myCart?success=true",
            cancel_url: "http://localhost:3000/myCart?cancel=true",
        })
        const payment = new Payment(body)
        payment.user = req.user.id,
        payment.transactionId = session.id
        payment.userEmail = body.userEmail
        payment.totalAmount = body.totalAmount
        
        await payment.save()
        //console.log('pay',payment)

        // if(body.userEmail){
        //     const info = await transporter.sendMail({
        //         from: `Shrikant Shivangi ${process.env.NODE_MAILER_MAIL}`, // sender address
        //         to: `${body.userEmail}`, // list of receivers
        //         subject: "Order Recieved", // Subject line
        //         text: "We have recieved your order.Thanks! for being a part of reStock.", // plain text body
        //         html: "<b>We have recieved your order.Thanks! for being a part of reStock.</b>", // html body
        //       });
        
        //       //console.log("Message sent: %s", info.messageId);
        // }
        res.json({
            url :session.url,
            id : session.id
        })
    } catch (e) {
        console.log('pc',e)
    }
}

paymentCltr.update = async (req,res) => {
    const {id} = req.params
    try {
        const updatePayment = await Payment.findOneAndUpdate(
            {transactionId:id},{status:'success'},{new:true}
        )
        if(updatePayment.userEmail){
            const info = await transporter.sendMail({
                from: `Shrikant Shivangi ${process.env.NODE_MAILER_MAIL}`, // sender address
                to : `${updatePayment.userEmail}`,
                subject : "Payment Succesfull",
                text : `We have successfully recieved your payment.`,
                html : "<b>We have successfully recieved your payment</b>"

            })
        }
        res.json(updatePayment)
    } catch (e) {
        res.status(500).json({errors:[{msg:e.message}]})
    }
}

paymentCltr.list = async(req,res) => {
    try{
        const paymentList = await Payment.find({status:'pending'})
        res.json(paymentList)
    } catch(e){
        res.status(500).json({errors:[{msg:e.message}]})
    }
}

paymentCltr.delete = async(req,res)=> {
    const {id} = req.params
    try {
        const deletePayment = await Payment.findOneAndDelete({transactionId:id})
        res.json(deletePayment)
    } catch (e) {
        res.status(500).json({errors:[{msg:e.message}]})
    }
}

module.exports = paymentCltr