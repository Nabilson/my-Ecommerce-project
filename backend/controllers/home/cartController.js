const cartModel = require('../../models/cartModel')
const { responseReture } = require('../../utilities/response')
const {mongo: {ObjectId}} = require('mongoose')
const wishlistModel = require('../../models/wishlistModel')

class cartController{

add_to_cart =  async(req, res) => {
		const {userId, productId, quantity} = req.body
        try{
        	const product = await cartModel.findOne({
        		$and: [{
        			productId : {
        				$eq: productId
        			}
        		},
        		{
        			userId: {
        				$eq: userId
        			}
        		}
        	]
        	})

        	if (product){
        		responseReture(res,404,{error: "Product already added to cart"})
        	}else{
        		const product = await cartModel.create({
        			userId,
        			productId,
        			quantity
        		})
        		responseReture(res,201,{message: "Added to cart", product})
        	}

        }catch(error){
        	console.log(error.message)
        }
        console.log(req.body)
    }
    // End Method 

    get_cart_products = async(req,res) => {
    	const co = 5;
    	const {userId} = req.params
    	try{
    		const cart_products = await cartModel.aggregate([{
    			$match: {
    				userId: {
    					$eq: new ObjectId(userId)
    				}
    			}
    		},
    		{
    			$lookup : {
    				from: 'products',
    				localField: 'productId',
    				foreignField: '_id',
    				as: 'products'
    			}	
    		}
    	])
    	let buy_product_item = 0;
    	let calculatePrice = 0;
      	let cart_product_count = 0;
      	const outOfStockProduct = cart_products.filter(p => p.products[0].stock < p.quantity)
      	for (let i = 0; i < outOfStockProduct.length; i++) {
         cart_product_count = cart_product_count + outOfStockProduct[i].quantity        
      	}
      	const stockProduct = cart_products.filter(p => p.products[0].stock >= p.quantity)
      	for(let i = 0; i < stockProduct.length; i++ ){
      		
            const {quantity} = stockProduct[i]
      		cart_product_count = buy_product_item + quantity

      		buy_product_item = buy_product_item + quantity
      		const {price, discount} = stockProduct[i].products[0]
      		if(discount !==0){
      			calculatePrice = calculatePrice + quantity * (price - Math.floor((price*discount)/100))
      		}else {
      			calculatePrice = calculatePrice + quantity * price
      		}
      	} //end for
      	let p =[]
      	let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))]
      	for(let i = 0; i < unique.length; i++ ){
      		let price=0;
      		for(let j = 0; j < stockProduct.length; j++ ){
      			const tempProduct = stockProduct[j].products[0]
      			if(unique[i] === tempProduct.sellerId.toString()){
      				let pri = 0;
      				if(tempProduct.discount !==0){
      					pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount)/100)
      				}else{
      					pri = tempProduct.price
      				}
      		pri = pri - Math.floor((pri * co)/100)	
      		price = price + pri * stockProduct[j].quantity
      		p[i] = {
      			sellerId: unique[i], 
      			shopName: tempProduct.shopName,
      			price,
      			products: p[i] ? [
      				...p[i].products, 
      				{
      					_id: stockProduct[j]._id,
      					quantity: stockProduct[j].quantity,
      					productInfo: tempProduct
      				}
      			] : [{
      				_id: stockProduct[j]._id,
      				quantity: stockProduct[j].quantity,
      				productInfo: tempProduct
      			}]
      		}	


      			}
      		}
      	}

    		responseReture(res,200,{
    			cart_products: p,
    			price: calculatePrice,
    			cart_product_count,
    			shipping_fee: 20 * p.length,
    			outOfStockProduct,
    			buy_product_item
    		})

    	} catch (error){
            console.log(error.message)
    	}

    }
    // End Method

     delete_cart_products = async (req, res) => {
        const {cart_id } = req.params
        try {
            await cartModel.findByIdAndDelete(cart_id)
            responseReture(res,200,{message: "Product Removed Successfully" })
            
        } catch (error) {
            console.log(error.message)
        }
         
    }
       // End Method 

    quantity_inc = async (req, res) => {
        const {cart_id } = req.params
        try {
            const product = await cartModel.findById(cart_id)
            const {quantity} = product
            await cartModel.findByIdAndUpdate(cart_id, {quantity: quantity + 1})
            responseReture(res,200,{message: "Qty Updated" })
            
        } catch (error) {
            console.log(error.message)
        }
         
    }
       // End Method 

     quantity_dec = async (req, res) => {
        const {cart_id } = req.params
        try {
            const product = await cartModel.findById(cart_id)
            const {quantity} = product
            await cartModel.findByIdAndUpdate(cart_id, {quantity: quantity - 1})
            responseReture(res,200,{message: "Qty Updated" })
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: 'Internal server error' });
        }
         
    }
       // End Method 

    add_wishlist = async (req, res) => {
        //console.log(req.body)

        const {slug} = req.body
        try{
            const product = await wishlistModel.findOne({slug})
            if (product){
                responseReture(res, 404, {
                    message: 'This Product is Already in Wishlist'
                })

            }else{
                await wishlistModel.create(req.body)
                responseReture(res, 201 ,{
                   message: 'Product Add to Wishlist Success'
            })
            }
        } catch (error){
            console.log(error.message)
        }
    }

    // End Method

    get_wishlist = async (req, res) => {
        const {userId} = req.params
        try {
            const wishlists = await wishlistModel.find({
                userId
            })
            responseReture(res, 200, {
                wishlistCount: wishlists.length,
                wishlists
            })
        } catch (error){
            console.log(error.message)
        }
    }
       // End Method 

    remove_wishlist = async (req, res) => {
        const {wishlistId} = req.params
        try {
            const wishlist = await wishlistModel.findByIdAndDelete(wishlistId)
            responseReture(res, 200, {
                message: 'WishList Product Remove',
                wishlist
            })

        }catch (error){
            console.log(error.message)
        }
        //console.log(req.params)
    }
}

module.exports =  new cartController()