const User = require('../models/user-model') 
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const _ = require('lodash')

const transporter = require('../../config/nodemailer')

const usersCltr = {} 

usersCltr.register = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }

    const body = _.pick(req.body,['userName','firstName','lastName', 'email', 'password', 'phoneNumber','role' ])

    // santize role 
    if( body.role == 'admin' ){
        body.role = 'user'
    }

    try {
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const hashedPassword = await bcryptjs.hash(user.password,salt)
        user.password = hashedPassword
        // assign first user as admin
        const totalUser = await User.countDocuments()
        if( totalUser == 0 ){
            user.role = 'admin'
        }
        const usr = await user.save()
        if(usr){
            const token = jwt.sign({id: usr._id, role : usr.role },process.env.JWT_SECRET)
            const verificationLink = `http://localhost:3055/api/users/verify/${token}`

            const mailOptions = {
                from: process.env.NODE_MAILER_MAIL, // Sender email
                to: user.email || 'shrikanthshivangi@gmail.com' && "nishanbangera4321@gmail.com",  // Newly registered user's email
                subject: 'Email Verification',
                html: `
                    <p>Hello,</p>
                    <p>Thank you for registering! Please click the following link to verify your email:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>Best regards,</p>
                `
            }
            await transporter.sendMail(mailOptions)
            res.json({
                usr,
                msg : `${usr.userName}, Please Verify your email send to your email address to access your account`
            })
        }
        //res.json(user)

    } catch (e) {
       res.status(500).json(e) 
    }

}

usersCltr.verify = async(req,res) => {
    const token = req.params.token

    try {
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        
        const user = await User.findOne({ _id: verifyToken.id })
        if( user.verified == false ){
            user.verified = !user.verified
            const verified = await user.save()
            if(verified){
                res.json("Thankyou for registering with us.... Your account has been successfully verified.Please login to continue")
            } else {
                res.json({ msg: "Your account has already been verified....Please login to continue" })
            }
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.login = async(req,res) => {
    const errors = validationResult(req)
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array() })
    }
    const body = _.pick(req.body, ['email','password'] )
    try {
        const user = await User.findOne({ email : body.email })
        if(!user){
            return res.status(404).json({ errors : [ { msg : 'invalid email/password' } ] })
        }

        const result = await bcryptjs.compare(body.password, user.password )
        if(!result){
            return res.status(404).json({ errors : [ { msg : 'invalid email/password' } ] })
        }

        const tokenData = { id : user._id , role : user.role }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET )
        res.json({ token : `bearer ${token}`})

    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.profile = async(req,res) => {
    const id = req.user.id 
    try {
        const user = await User.findById(id)
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.listUsers = async(req,res) => {
    try {
        const user = await User.find({ role : 'user' })
        if(!user){
            return res.status(404).json({errors : 'not-found' })
        }
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.listAll = async(req,res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.changeRole = async(req,res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['role'])
    if( id == req.user.id ){
        return res.status(400).json({error:'operation cannot be performed'})
    }
    try {
        const user = await User.findByIdAndUpdate( id ,body , {new:true} )
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.removeUser = async(req,res) => {
    const id = req.params.id
    // if( id == req.user.id ){
    //     return res.status(400).json({error:'yourself cant delete'})
    // }
    try {
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return res.status(400).json({error:'while deleting'})
        }
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

usersCltr.updateProfile = async(req,res) => {
    const id = req.params.id

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }

    const body = _.pick(req.body,['userName','email','phoneNumber','password'])

    try {
        if(req.user.id == id){
            const usr = await User.findOneAndUpdate({ _id : id }, body, {new:true})
            const salt = await bcryptjs.genSalt()
            const hashedPassword = await bcryptjs.hash(usr.password,salt)
            usr.password = hashedPassword
            usr.save()
            res.json(usr)
        } else {
            res.status(401).json({ errors : [ { msg : 'Unauthorized' } ] })
        }
    } catch (e) {
        res.status(500).json(e)
    }

}

usersCltr.deleteAccount = async(req,res) => {
    const id = req.params.id
    try {
        if( id == req.user.id ){
            const user = await User.findByIdAndDelete(id)
            if(!user){
                return res.status(400).json({error : `cant find account `})
            }
            res.json(user)
        } else {
            return res.status(400).json({error:'while deleting'})
        }
        
    } catch (e) {
        res.status(500).json(e)
    }

}


module.exports = usersCltr