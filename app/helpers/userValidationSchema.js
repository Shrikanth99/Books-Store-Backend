const User = require('../models/user-model')

const userNameSchema = {
    notEmpty : {
        errorMessage : 'username is required'
    }
}

const firstNameSchema = {
    notEmpty : {
        errorMessage : 'first-name is required'
    }
}

const lastNameSchema = {
    notEmpty : {
        errorMessage : 'last-name is required'
    }
}

const passwordSchema = {
    notEmpty : {
        errorMessage : 'password is required '
    },
    isLength  : {
        options : {min : 8, max : 128},
        errorMessage : 'password should be between 8-128 characters '
    }

}

const phoneNumberSchema = {
    notEmpty : {
        errorMessage : 'Phone number is required'
    },
    isLength : {
        options : { min:10, max : 10 },
        errorMessage : 'phone number should be 10 digits '
    },
    isNumeric : {
        errorMessage : 'phone number should contain only numeric'
    },
    custom : {
        options : async(value) => {
            const user = await User.findOne({phoneNumber : value})
            if(user){
                throw new Error(' phoneNumber is already exist ')
            } else {
                return true
            }
        }
    }
}

const emailRegisterSchema = {
    notEmpty : {
        errorMessage : 'email is required'
    },
    isEmail : {
        errorMessage : 'Invalid email format'
    },
    custom : {
        options : async(value) => {
            const user = await User.findOne({email : value })
            if(user){
                throw new Error('user already exists')
            } else {
                return true
            }
        }
    }
}

const emailLoginSchema = {
    notEmpty : {
        errorMessage : 'email is reuired'
    },
    isEmail : {
        errorMessage : 'Inavlid email format'
    }
}

const userRegisterValidationSchema = {
    userName : userNameSchema,
    email : emailRegisterSchema,
    password : passwordSchema,
    phoneNumber : phoneNumberSchema
}

const userLoginValidationSchema = {
    email : emailLoginSchema,
    password : passwordSchema
}

module.exports = {
    userRegisterValidationSchema,
    userLoginValidationSchema
}