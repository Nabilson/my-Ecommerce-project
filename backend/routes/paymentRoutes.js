const paymentController = require('../controllers/payment/paymentController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router()



router.get('/payment/create-stripe-connect-account', authMiddleware, paymentController.create_stripe_connect_account)


//router.get('/logout', authMiddleware, authControllers.logout)

module.exports = router