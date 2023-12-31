const orderValidationschema = {
    user : {
        isMongoId : {
            errorMessage:"should be a valid mongoId"
        }
    },
    orderItem : {
        isArray : {
            errorMessage : 'should be Array'
        }
    },
    payment : {
        isMongoId : {
            errorMessage : 'should be valid mongoId'
        }
    },
    
}