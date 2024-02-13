const mongoose = require('mongoose')
const Address = require('../app/models/address-model')

const configureDb = async() =>{
    const dbName = process.env.DB_NAME
    const dbURL = process.env.DB_URL
    try{
        await mongoose.connect(`${dbURL}/${dbName}`)
        console.log(`connected to the book-store database`)
        await Address.createIndexes({ "location": "2dsphere" });
        console.log(`Geospatial index created on 'location' field of 'addressesTree' collection`);
        // await Address.createIndexes({ "location": "2dsphere" },err => {
        //     if(err){
        //         console.log('Error Creating geospatial Index',err)
        //     }else {
        //         console.log('Geo-spatial Index created');
        //     }
        // })
    }
    catch(e){
        console.log('error connecting to the db',e)
    }
}

module.exports = configureDb