const express = require('express')
const { stripeKey, razorpayKey, captureStripePayment, captureRazorpayPayment } = require('../controllers/payment.controller')
const { isLoggedIn } = require('../middlewares/user.middleware')
const router = express.Router()

router.route('/stripekey').get(isLoggedIn, stripeKey)
router.route('/razorpaykey').get(isLoggedIn, razorpayKey)

router.route("/capturestripe").post(isLoggedIn, captureStripePayment)
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment)

module.exports = router