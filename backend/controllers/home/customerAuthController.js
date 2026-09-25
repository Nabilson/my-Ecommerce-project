const customerModel = require('../../models/customerModel')
const {responseReture} = require('../../utilities/response')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const {createToken} = require('../../utilities/tokenCreate')

class customerAuthController{

	customer_register = async(req,res) => {
		const {name, email, password} = req.body

		try{
			const customer = await customerModel.findOne({email})
			if(customer){
				responseReture(res, 404, {error: 'Email Already Exists'})
			}else {
				const createCustomer = await customerModel.create({
					name: name.trim(),
					email: email.trim(),
					password: await bcrypt.hash(password, 10),
					method: 'manually'
				})
				await sellerCustomerModel.create({
					myId: createCustomer.id
				})
				const token = await createToken({
					id: createCustomer.id,
					name: createCustomer.name,
					email: createCustomer.email,
					method: createCustomer.method
				})
				res.cookie('customerToken', token, {
					expires: new Date(Date.now()+7*24*60*1000)
				})
				responseReture(res,201,{message: "User Registration Success", token})

			}
		}catch (error){
			console.log(error.message)
		}
    }
    //End Method

    customer_login = async(req, res) => {
    	const {email, password} = req.body
    	try{
    		const customer = await customerModel.findOne({email}).select('+password')
    		if(customer){
    			const match = await bcrypt.compare(password, customer.password)
    			if(match){
    				const token = await createToken({
					id: customer.id,
					name: customer.name,
					email: customer.email,
					method: customer.method
				})
    			res.cookie('customerToken', token, {
					expires: new Date(Date.now()+7*24*60*1000)
				})
				responseReture(res,201,{message: "User Login Success", token})

    			}else {
    				responseReture(res,404,{error: "Password is Wrong"})
    			}
    		}else{
    			responseReture(res,404,{message: "Email not found"})
    		}
    	}catch (error){
    		console.log(error.message)
    	}
    }

    //End Method

    customer_logout = async(req, res) => {
    	res.cookie('customerToken', "",{
    		expires: new Date(Date.now())
    	} )
    	responseReture(res,200,{message: "Logout Successful"})
    }
     //End Method

}

module.exports =  new customerAuthController()