const cartValidationSchema = {
    userId:{
        isMongoId:{
            errorMessage:"should be a valid mongoId"
        }
    },
    products:{
        notEmpty:{
            errorMessage:'no product has been selected'
        }
    }
}

module.exports = cartValidationSchema