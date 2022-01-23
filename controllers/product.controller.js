const Product = require('../models/product.model')
const WhereCaluse = require('../utils/WhereClause')
const { createResult } = require('../utils/responseHandler')
const cloudinary = require('cloudinary').v2


exports.addProduct = async (req, res) => {
    try {
        let imageArray = []
        let result;
        if (!req.files) throw new Error('Images are required')

        if (req.files) {
            for (let index = 0; index < req.files.photos.length; index++) {
                result = await cloudinary.uploader.
                    upload(req.files.photos[index].tempFilePath, {
                        folder: 'products'
                    })

                imageArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                })

            }
        }

        req.body.photos = imageArray
        req.body.user = req.user.id

        const product = await Product.create(req.body)

        res.status(200).send(createResult(null, product))
    } catch (error) {
        res.status(400).send(createResult(error))
    }
}

exports.getAllProduct = async (req, res) => {
    try {
        const resultPerPage = 6
        const totalCountProduct = await Product.countDocuments()
        // const products = await Product.find({})
        //product obj from the query
        let productsObj = new WhereCaluse(Product.find(), req.query).search().filter()
        //awaiting product.find
        let products = await productsObj.base
        const filteredProductNumber = products.length

        productsObj.pagination(resultPerPage)
        products = await productsObj.base.clone()


        res.status(200).send(createResult(null, { products, filteredProductNumber, totalCountProduct }))
    } catch (error) {
        res.status(500).send(createResult(error.message))
    }
}

exports.getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) throw new Error('No product found')

        res.status(200).send(createResult(null, product))
    } catch (error) {
        res.status(401).send(createResult(error.message))
    }
}

exports.addReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        let product = await Product.findById(productId)
        const alreadyReviewed = product.reviews.find(review => (
            review.user.toString() === req.user._id.toString()
        ))

        if (alreadyReviewed) {
            product.reviews.forEach(review => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment
                    review.rating = rating
                }
            })
        } else {
            product.reviews.push(review)
            product.numberOfReviews = product.reviews.length
        }

        //adjust ratings
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0)
            / product.reviews.length

        await product.save({ validateBeforeSave: false })

        res.status(200).send(createResult(null, { message: 'review added successfully' }))
    } catch (error) {
        res.status(401).send(createResult(error.message))
    }
}

exports.getReviewsForOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.query.id)

        res.status(200).send(createResult(null, { reviews: product.reviews }))
    } catch (error) {

    }
}

exports.deleteReview = async (req, res) => {
    try {
        const { productId } = req.query

        const product = await Product.findById(productId)

        const reviews = product.reviews.filter(review => {
            return review.user.toString() === req.user._id.toString()
        })

        const numberOfReviews = reviews.length

        //adjust ratings
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0)
            / product.reviews.length

        await Product.findByIdAndUpdate(productId, {
            reviews,
            numberOfReviews
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).send(createResult(null, 'Review Deleted successfully'))
    } catch (error) {
        res.status(401).send(createResult(error.message))
    }
}

exports.adminGetAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})

        res.status(200).send(createResult(null, products))
    } catch (error) {
        res.status(500).send(createResult(error.message))
    }
}

exports.adminUpdateOneProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
        let imagesArray = []
        if (!product) throw new Error('No product found')

        if (req.files) {
            //destroying the old file
            for (let index = 0; index < product.photos.length; index++) {
                const res = await cloudinary.uploader.destroy(product.photos[index].id)

            }

            //uploading the new file
            for (let index = 0; index < req.files.photos.length; index++) {
                for (let index = 0; index < req.files.photos.length; index++) {
                    const result = await cloudinary.uploader.
                        upload(req.files.photos[index].tempFilePath, {
                            folder: 'products'
                        })

                    imagesArray.push({
                        id: result.public_id,
                        secure_url: result.secure_url
                    })
                }
            }
        }

        req.body.photos = imagesArray
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.status(200).send(createResult(null, product))
    } catch (error) {
        res.status(401).send(createResult(error.message))
    }
}

exports.adminDeleteOneProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)

        if (!product) throw new Error('No product found')

        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.uploader.destroy(product.photos[index].id)

        }

        await product.remove()
        res.status(200).send(createResult(null, { message: 'Product deleted successfully!' }))
    } catch (error) {
        res.status(401).send(createResult(error.message))
    }
}