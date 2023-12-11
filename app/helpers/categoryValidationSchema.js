const Category = require('../models/category-model')

const categoryValidationSchema = {
    name : {
        notEmpty : {
            errorMessage : ' category should not empty '
        },
        custom : {
            options : async(value) => {
                const category = await Category.findOne({ name : { '$regex' : value , $options : 'i' } })
                if(!category){
                    return true
                } else {
                    throw new Error('Category already present')
                }
            }
        }
    }
}

module.exports = categoryValidationSchema