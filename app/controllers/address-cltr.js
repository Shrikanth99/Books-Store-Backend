const Address = require('../models/address-model')
const {validationResult} = require('express-validator')
const _ = require('lodash')
const addressCltr = {}

addressCltr.create = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['firstName','lastName','phoneNumber','houseNumber','address','landMark','city','state','country','pinCode','addressType','defaultAdd'])
    const address = new Address(body)
    address.userId = req.user.id
    try{
        await address.save()
        console.log(address)
        res.json({msg:'saved successfully',address})
    }
    catch(e){
        res.status(500).json(e)
    }
}

addressCltr.list = async(req,res) =>{
    const id = req.user.id
    try{
        const address = await Address.find({userId:id})
        res.json(address)
    }
    catch(e){
        res.status(500).json(e)
    }
}

addressCltr.update = async(req,res) => {
    const id = req.params.id
    const body = _.pick(req.body,['fullName','phoneNumber','houseNumber','address','landMark','city','state','country','pinCode','addressType','defaultAdd'])
    try {
        if( req.user.role == 'user' ){
            const address = await Address.findOneAndUpdate({_id: id , userId : req.user.id },body,{new:true})
            res.json(address)
        }
    } catch (e) {
        
    }
}

addressCltr.remove = async(req,res) =>{
    const id = req.params.id
    try{
        const address = await Address.findOneAndDelete({userId:req.user.id,_id:id})
        res.json(address)
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = addressCltr