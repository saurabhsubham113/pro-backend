const express = require('express')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middlewares/user.middleware')
const { addProduct, getAllProduct, adminGetAllProducts, getOneProduct, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview, getReviewsForOneProduct } = require('../controllers/product.controller')

//user routes
router.route('/products').get(getAllProduct)
router.route('/product/:id').get(getOneProduct)
router.route('/review').put(isLoggedIn, addReview)
router.route('/reviews').get(getReviewsForOneProduct)
router.route('/review').delete(isLoggedIn, deleteReview)

//admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'), addProduct)
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProducts)
router.route('/admin/product/:id').put(isLoggedIn, customRole('admin'), adminUpdateOneProduct)
router.route('/admin/product/:id').delete(isLoggedIn, customRole('admin'), adminDeleteOneProduct)

module.exports = router