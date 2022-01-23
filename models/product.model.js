const mongoose = require('mongoose')
const userModel = require('./user.model')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [120, 'Product name should not be greater than 120 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        maxlength: [5, 'Product price should not be greater than 5 digits']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true,
            'Please select category - shortsleeves,longsleeves,sweatshirts,hoodies'],
        enum: {
            values: [
                'shortsleeves',
                'longsleeves',
                'sweatshirts',
                'hoodies'
            ],
            message: 'Please select category ONLY from- short-sleeves,long-sleeves,sweat-shirts and hoodies'
        }
    },
    brand: {
        type: String,
        required: [true, 'Brand name is required']
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model('Product', productSchema)