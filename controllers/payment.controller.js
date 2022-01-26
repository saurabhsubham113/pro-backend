const { createResult } = require('../utils/responseHandler')

const stripe = require('stripe')(process.env.STRIPE_SECRET)
const Razorpay = require('razorpay')

exports.stripeKey = async (req, res) => {
    res.status(200).send(createResult(null, process.env.STRIPE_API_KEY))
}

exports.captureStripePayment = async (req, res) => {
    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            //optional
            metadata: { integration_check: "accept_a_payment" },
        });
        res.status(200).send(createResult(null,
            { amount: req.body.amount, client_secret: paymentIntent.client_secret }))
    } catch (error) {
        res.status(500).send(createResult(error.message))
    }
}

exports.razorpayKey = (req, res) => {
    res.status(200).send(createResult(null, process.env.RAZORPAY_API_KEY))
}

exports.captureRazorpayPayment = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
        };

        const myOrder = await instance.orders.create(options)

        res.status(200).send(createResult(null, { amount: req.body.amount, order: myOrder }))
    } catch (error) {
        res.status(500).send(createResult(error.message))
    }
}