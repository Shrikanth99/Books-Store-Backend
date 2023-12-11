const addressValidationSchema = {
    userId:{
        isMongoId:{
            errorMessage:'should be a valid mongoId'
        }
    },   
    fullName:{
        notEmpty:{
            errorMessage:'Name is required'
        }
    },
    phoneNumber:{
        notEmpty:{
            errorMessage:'phone number is required'
        },
        isLength:{
            options:{min:10,max:10}
        },
        isMobilePhone: {
            options: ['any'],
            errorMessage: 'Invalid mobile number format'
        }

    },
    houseNumber:{
        notEmpty:{
            errorMessage:'house Number is required'
        }
    },
    address:{
        notEmpty:{
            errorMessage: 'address is required'
        }
    },
    landMark:{
        notEmpty:{
            errorMessage: 'landmark is required'
        }
    },
    city:{
        notEmpty:{
            errorMessage: 'city is required'
        }
    },
    state:{
        notEmpty:{
            errorMessage: 'state is required'
        }
    },
    country:{
        notEmpty:{
            errorMessage:'country is required'
        }
    },
    pincode:{
        notEmpty:{
            errorMessage:'pincode is required'
        },
        isNumeric : {
            errorMessage : 'pincode should contain only numeric'
        },
        isLength:{
            options:{min:6,max:6}
        }
    },
    addressType:{
        notEmpty:{
            errorMessage: 'address type is required'
        }
    }

}

module.exports = addressValidationSchema