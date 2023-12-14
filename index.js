require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3055
const multer = require('multer')
const {userRegisterValidationSchema,userLoginValidationSchema,updateProfileValidationSchema} = require('./app/helpers/userValidationSchema')
const categoryValidationSchema = require('./app/helpers/categoryValidationSchema')
const {checkSchema} = require('express-validator')
const addressValidationSchema = require('./app/helpers/addressValidationSchema')
const reviewValidationSchema = require('./app/helpers/reviewValidationSchema')

// controllers
const usersCltr = require('./app/controllers/users-cltr')
const addressCltr = require('./app/controllers/address-cltr')
const categoryCltr = require('./app/controllers/category-cltr')
const reviewCltr = require('./app/controllers/review-cltr')
const productCltr = require('./app/controllers/product-cltr')
const cartCltr = require('./app/controllers/cart-cltr')

const {authenticateUser,authorizeUser} = require('./app/middlewares/authentication')

const configureDb = require('./config/db')
const wishlistCltr = require('./app/controllers/wishlistCltr')
configureDb()

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static('uploads'))

const upload = multer()
//user routes
app.post('/api/register', checkSchema(userRegisterValidationSchema) , usersCltr.register )
app.post('/api/login', checkSchema(userLoginValidationSchema) , usersCltr.login )
app.get('/api/users/verify/:token', usersCltr.verify)
app.get('/api/users/profile', authenticateUser , usersCltr.profile  )
app.get( '/api/list-all' , authenticateUser, authorizeUser(['admin']), usersCltr.listAll )
app.get('/api/list-all-users', authenticateUser, authorizeUser(['admin']) ,usersCltr.listUsers )
// update profile
app.put('/api/user/update-profile/:id', checkSchema(updateProfileValidationSchema) ,authenticateUser,authorizeUser(['user']), usersCltr.updateProfile)
app.put('/api/user/:id/change-role', authenticateUser, authorizeUser(['admin']), usersCltr.changeRole)
app.delete('/api/user/:id', authenticateUser ,authorizeUser(['admin']) , usersCltr.removeUser )
app.delete('/api/user-acc/:id', authenticateUser , usersCltr.deleteAccount )

//address routes
app.post('/address',checkSchema(addressValidationSchema),authenticateUser,authorizeUser(['user']),addressCltr.create)
app.get('/address',authenticateUser,addressCltr.list)
app.put('/address/:id',authenticateUser,addressCltr.update)
app.delete('/address/:id',authenticateUser,addressCltr.remove)

//category routes
app.post('/categories', checkSchema(categoryValidationSchema), authenticateUser, authorizeUser(['admin']) , categoryCltr.create )
app.get('/categories', authenticateUser, categoryCltr.list )
app.delete('/categories/:id', authenticateUser , authorizeUser(['admin']) , categoryCltr.destroy )

//product routes
app.post('/product/:id',authenticateUser,authorizeUser(['admin']),upload.array('image'),productCltr.create)
app.get('/product',productCltr.list)
app.put('/product/:id',authenticateUser,authorizeUser(['admin']),productCltr.update)
app.delete('/product/:id',authenticateUser,authorizeUser(['admin']),productCltr.delete)

//review Routes
app.post('/product/review/:id',checkSchema(reviewValidationSchema),authenticateUser,authorizeUser(['user']),reviewCltr.create)
app.get('/product/review',authenticateUser,reviewCltr.list)
app.put('/product/review/:id',authenticateUser,checkSchema(reviewValidationSchema),authorizeUser(['user']),reviewCltr.update)
app.delete('/product/:pId/review/:rId',authenticateUser,authorizeUser(['user','admin']),reviewCltr.delete)

//cart routes
app.post('/product/cart/:id',authenticateUser,authorizeUser(['user']),cartCltr.create)
app.get('/product/cart/list',authenticateUser,authorizeUser(['user']),cartCltr.list)
app.put('/product/cartItemRemove/:id',authenticateUser,authorizeUser(['user']),cartCltr.removeItem)
app.delete('/product/cart/quantity/:id',authenticateUser,authorizeUser(['user']),cartCltr.removeQuantity)
app.delete('/product/cart/removeAll',authenticateUser,authorizeUser(['user']),cartCltr.removeAll)

//wishlist routes
app.post('/product/wishlist/:productId',authenticateUser,authorizeUser(['user']),wishlistCltr.create)
app.delete('/product/wishlist/:wishlistId',authenticateUser,authorizeUser(['user']),wishlistCltr.delete)

app.listen(port,()=>{
    console.log('server listening to the port',port)
})
