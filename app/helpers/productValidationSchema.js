const Product = require('../models/product-model')

const productValidationSchema = {
    title : {
        notEmpty : {
            errorMessage : 'Title is required'
        },
        custom : {
            options : async(value) => {
                const product = await Product.findOne({ title : { '$regex' : value , $options : 'i' } })
                if(!product){
                    return true
                } else {
                    throw new Error('Same title is already present')
                }
            }
        }
    },
    author : {
        notEmpty : {
            errorMessage : 'Author name is required'
        }
    },
    image : {
        notEmpty : {
            errorMessage : 'Image is reuired'
        }
    },
    description : {
        notEmpty : {
            errorMessage : 'Description should not be empty'
        },
        isLength : {
            options : { min:50, max : 300 },
            errorMessage : 'description should between 50 to 200 char'
        }
    },
    price : {
        notEmpty : {
            errorMessage : 'Price is required'
        },
        isNumeric : {
            errorMessage : 'Price should be a number '
        }
        // custom : {
        //     options : (value) => {
        //         const price = parseFloat(value)
        //         if(isNaN(price)){
        //             throw new Error('Invalid price format ')
        //         } else if( price <= 0 || price > 10000 ) {
        //             throw new Error(' price is exceded ')
        //         } else {
        //             throw new Error('Price should number')
        //         }
        //     }
        // }
    },
    categoryId  : {
        isMongoId : {
            errorMessage : 'Invalid MongoId'
        }
    },
    condition : {
        notEmpty : {
            errorMessage : 'Condition should be provided'
        },
        isIn : {
            options : [['Good', 'Fair']],
            errorMessage : 'Condition Should be Good or Fair'
        }
    },
    // stockCount : {
    //     isNumeric : {
    //         errorMessage : 'Stock Count Should be Number'
    //     }
    // }
}

module.exports = productValidationSchema