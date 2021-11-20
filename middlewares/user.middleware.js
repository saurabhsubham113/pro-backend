const jwt = require('jsonwebtoken')
const { createResult } = require('../utils/responseHandler')
const User = require('../models/user.model')

exports.isLoggedIn = async (req, res, next) => {

    if (!(req.cookies.token || req.header("Authorization"))) {
        return res.status(401).send(createResult('Please Login to continue'))
    }
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "")

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decode.id)
    next()
}

//making the role customizable
exports.customRole = (...roles) => {
    return (req, res, next) => {
        //we are checking if roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).send(createResult('you are not allowed to view the resource'))
        }

        next()
    }
}