const reviewValidationSchema = {
    rating : {
        notEmpty : {
            errorMessage : 'Ratings should not be empty'
        },
        isNumeric : {
            errorMessage : 'rating should be a number'
        },
          isInt : {
            options:{gt:0,lt:6},
            errorMessage: 'rating should be between 0 to 6'
        }
        // custom : {
        //     options : (value) => {
        //         const rating = parseFloat(value)
        //         if( rating > 5 ){
        //             throw new Error('rating should less than 5')
        //         } else  {
        //             return true
        //         }
        //     }
        // }
    },
    review:{
        notEmpty:{
            errorMessage:'review is required'
        }
    }

}

// const reviewEditValidationSchema = {
//     rating : {
//         notEmpty : {
//             errorMessage : 'Ratings should not be empty'
//         },
//         isNumeric : {
//             errorMessage : 'rating should be a number'
//         },
//         isInt : {
//             options:{gt:0,lt:6},
//             errorMessage: 'rating should be between 0 to 6'
//         }
        
//         // custom : {
//         //     options : (value) => {
//         //         const rating = parseFloat(value)
//         //         if( rating > 5 ){
//         //             throw new Error('rating should less than 5')
//         //         } else  {
//         //             return true
//         //         }
//         //     }
//         // }
//     },
//     review:{
//         notEmpty:{
//             errorMessage:'review is required'
//         }
//     }

// }

module.exports = reviewValidationSchema