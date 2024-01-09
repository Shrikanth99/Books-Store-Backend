const Procurement = require('../models/procurement-model')
const Address = require('../models/address-model')
const _ = require('lodash')


const procurementCltr = {}

procurementCltr.create = async(req,res) =>{
    // const {sellerId} = req.params
    const body = req.body
    //console.log('hello',body)
    try{
        const address = await Address.findOne({_id:body.address})
        const [long,lat] = address.location.coordinates
        console.log('test',long,lat)
        const nearAdd = await Address.aggregate([
            {
                $geoNear: {
                    near : {type:'Point', coordinates : [long,lat]},
                    key : 'location',
                    distanceField: "dist.calculated",
                    // spherical:true
                }    
            },
            {
                $lookup: {
                    from: 'users', // Replace 'users' with the name of the User collection
                    localField: 'userId',
                    foreignField: '_id',
                    as:'user'
                }
            },
        ])
        const findModerator = nearAdd.find(ele=>ele.user[0].role === 'moderator')
        const procurement = new Procurement(body)
        procurement.seller = req.user.id
        procurement.buyer = findModerator.userId

        const savedProcurement = await procurement.save()
        res.json(savedProcurement)
    }
    catch(e){
        console.log('err',e)
        res.status(500).json(e)
    }
}



module.exports = procurementCltr