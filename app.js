const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()

//for swagger documentation
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//express can handle the incoming json response
app.use(express.json())

//handling the encoded url
app.use(express.urlencoded({ extended: true }))

//using cookie parser 
app.use(cookieParser())

//file upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}))

//logging information
app.use(morgan('dev'))


//importing all routes
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')


app.use('/api/v1', userRoute)
app.use('/api/v1', productRoute)

module.exports = app