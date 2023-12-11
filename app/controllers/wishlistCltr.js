const Product = require('../models/product-model')
const Wishlist = require('../models/wishlist-model')

const wishlistCltr = {}

wishlistCltr.create = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id

        const existingWishlistItem = await Wishlist.findOne({product:productId,user:userId})
        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
          }

          const newWishlistItem = new Wishlist({
            product: productId,
            user: userId,
          });
          await newWishlistItem.save();
      
          res.status(201).json({ message: 'Product added to wishlist successfully' });

    }
    catch (e) {
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