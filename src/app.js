const express = require('express')
require('./db/mongoose')   //this to establish database connection

const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const orderRouter = require('./routers/order')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)


module.exports = app
