const Order = require('../models/order.model')
const Product = require('../models/product.model')
const { createResult } = require('../utils/responseHandler')

exports.createOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount
        } = req.body

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
            user: req.user._id
        })
        res.status(200).send(createResult(null, order))
    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

exports.getOneOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "firstName lastName email")

        if (!order) throw new Error('Please check order Id')

        res.status(200).send(createResult(null, order))
    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

exports.getLoggedInOrders = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user._id })

        if (!order) throw new Error('Please check order Id')

        res.status(200).send(createResult(null, order))
    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

exports.adminGetAllOrders = async (req, res) => {
    try {
        const order = await Order.find()

        res.status(200).send(createResult(null, order))
    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

exports.adminUpdateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order.orderStatus === 'Delivered') throw new Error('order is already marked as delivered')

        order.orderStatus = req.body.orderStatus

        order.orderItems.forEach(async prod => {
            await updateProductStock(prod.product, prod.quantity)
        })
        await order.save()
        res.status(200).send(createResult(null, order))

    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

exports.adminDeleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        await order.remove()
        res.status(200).send(createResult(null, "order removed successfully"))

    } catch (error) {
        res.status(400).send(createResult(error.message))
    }
}

const updateProductStock = async (productId, quantity) => {

    const product = await Product.findById(productId)

    product.stock = product.stock - quantity

    await product.save({
        validateBeforeSave: false
    })

}