const Product = require('../models/product-model')
const Wishlist = require('../models/wishlist-model')

const wishlistCltr = {}

wishlistCltr.create = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id
        const existingWishlistItem = await Wishlist.findOne({product:productId,user:userId})
        if (existingWishlistItem) {

            return res.status(201).json({ message: 'Product already in wishlist' });
          }

          const newWishlistItem = new Wishlist({
            product: productId,
            user: userId,
          });
          const wishlistItem = await newWishlistItem.save();
          res.status(201).json({ message: 'Product added to wishlist successfully',
            wishlistItem
        });

    }
    catch (e) {
        res.status(500).json(e)
    }
}

wishlistCltr.list = async(req,res) =>{
    try{
        const {id} = req.user
        const items = await Wishlist.find({user:id})
        res.json(items)
    }
    catch(e){
        res.status(500).json(e)
    }
}

wishlistCltr.delete = async(req,res) =>{
    try{
        const wishlistId = req.params.wishlistId;
        const wishlistItem = await Wishlist.findByIdAndDelete(wishlistId)
        res.status(200).json(wishlistItem)
   
    }
    catch(e){
        return res.status(500).json(e)
    }
}

module.exports = wishlistCltr