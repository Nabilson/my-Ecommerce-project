const sellerModel = require ('../../models/sellerModel')
const stripeModel = require ('../../models/stripeModel')
const {v4: uuidv4} = require('uuid')
const { responseReture } = require('../../utilities/response')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class paymentController{

create_stripe_connect_account = async(req, res) => {

	const {id} = req
	const uid = uuidv4()

	try{
		const stripeInfo = await stripeModel.findOne({sellerId: id})

		if (stripeInfo){
			await stripeModel.deleteOne({ sellerId: id})
			const account = await stripe.accounts.create({type: 'express'})

			const accountLink = await stripe.accountLinks.create({
				account: account.id, 
				refresh_url: 'http://localhost:5173/refresh',
				return_url: `http://localhost:5173/success?activeCode=${uid}`,
				type: 'account_onboarding'
			})
			await stripeModel.create({
				sellerId: id,
				stripeId: account.id,
				code: uid
			})
			responseReture(res, 201, {url:accountLink.url  })
		}
		else{
			const account = await stripe.accounts.create({type: 'express'})

			const accountLink = await stripe.accountLinks.create({
				account: account.id, 
				refresh_url: 'http://localhost:5173/refresh',
				return_url: `http://localhost:5173/success?activeCode=${uid}`,
				type: 'account_onboarding'
			})
			await stripeModel.create({
				sellerId: id,
				stripeId: account.id,
				code: uid
			})
			responseReture(res, 201, {url:accountLink.url  })
		}

	}  catch (error){
		console.log('Stripe connect account error' + error.message)
		responseReture(res, 500, { error: 'Failed to create Stripe account' })
	}

 }

 // End Method

 active_stripe_connect_account = async (req, res) => {
 	const {activeCode} = req.params 
 	const {id} = req

 	try{
 		const userStripeInfo = await stripeModel.findOne({ code: activeCode })

 		if (userStripeInfo){
 			await sellerModel.findByIdAndUpdate(id,{
 				payment: 'active'

 			})
 			responseReture(res, 200, {message: 'payment Active'})
 		}else {
 			responseReture(res, 404, {message: 'payment Active Fails'})
 		}



 	}catch(error){
 		responseReture(res, 500, {message: 'Internal Server Error'})
 	}

 }

// End Method


}



module.exports = new paymentController()