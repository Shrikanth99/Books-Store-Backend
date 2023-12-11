const AWS = require("aws-sdk")
const {v4:uuidv4} = require("uuid")

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: 'v4'
})

async function uploadToS3(file){
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}-${file.originalname}`,
        Body: file.buffer
    }
    const data = await s3.upload(params).promise()
    return {url: data.Location, key: data.Key}
}

async function deleteFromS3(key) {
    const params = {
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: key
    }
 
    try {
       await s3.deleteObject(params).promise();
       console.log("image deleted");
       return true
    } catch (error) {
       return false
    }
 }

module.exports = {
    uploadToS3,
    deleteFromS3
}