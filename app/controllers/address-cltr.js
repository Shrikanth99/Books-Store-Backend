const Address = require('../models/address-model')
const {validationResult} = require('express-validator')
const _ = require('lodash')
const axios = require('axios')
const addressCltr = {}

addressCltr.create = async(req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['fullName','phoneNumber','houseNumber','address','landMark','city','state','country','pincode','addressType','defaultAdd','userId'])
    const searchString = `${body.houseNumber}%2C%20${body.landMark}%2C%20${body.pincode}%2C%20${body.city}%2C%20${body.state}%2C%20${body.country}`
    
    const address = new Address(body)
    // if(req.user?.id){
    //     address.userId = req.user.id
    // }
    try{
        const addresses = await Address.countDocuments({userId:req.user.id})
        if(addresses == 3){
            return res.status(400).json({errors:[{msg:'Cant create more than 3 addresses'}]})
        }
        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        if(mapResponse.data.features.length==0){
           return  res.status(400).json({errors:[{msg:"Invalid address",path:'invalid address'}]})
        }
        const location = [mapResponse.data.features[0].properties.lon,mapResponse.data.features[0].properties.lat]
        // console.log('ghj',location)
        address.location = {type:'Point',coordinates:location}
        await address.save()
        //console.log(address)
        res.json(address)
    }
    catch(e){
        res.status(500).json({errors:[{msg:e.message}]})
    }
}

addressCltr.list = async(req,res) =>{
    const id = req.user.id
    //console.log(id)
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
        res.status(500).json(e)
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