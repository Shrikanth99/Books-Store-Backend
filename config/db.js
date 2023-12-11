const mongoose = require('mongoose')

const configureDb = async() =>{
    const dbName = process.env.DB_NAME
    const dbURL = process.env.DB_URL
    try{
        await mongoose.connect(`${dbURL}/${dbName}`)
        console.log(`connected to the book-store database`)
    }
    catch(e){
        console.log('error connecting to the db',e.message)
    }
}

module.exports = configureDb