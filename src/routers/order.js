const express = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/orders', auth, async (req, res) => {
    const order = new Order({
        ...req.body,
        orderedBy: req.user._id
    })
    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderedBy: req.user._id })
        res.send(orders)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const order = await Order.findById(_id)

        if (!order) {
            return res.status(404).send({ error: "Order Not Found for Order Id" })
        }
        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

//id is order id
router.get('/orders/user/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const order = await Order.findOne({ _id, orderedBy: req.user._id })

        if (!order) {
            return res.status(404).json({ error: "Order Not Found for user" })
        }
        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/orders/:orderId/:userId', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }
    try {
        const order = await Order.findOne({ _id: req.params.orderId, orderedBy: req.params.userId })

        if (!order) {
            return res.status(404).send({ error: 'Order Not Found' })
        }
        updates.forEach((update) => order[update] = req.body[update])
        await order.save()
        res.send(order)
    } catch (e) {
        return res.status(400).send(e)
    }
})

module.exports = router
