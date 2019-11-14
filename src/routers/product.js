const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = express.Router()


router.post('/products', auth, async (req, res) => {
    const product = new Product({
        ...req.body
    })

    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// getting all products dont need auth middleware
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({})
        res.send(products)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/products/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const product = await Product.findOne({ _id })

        if (!product) {
            res.status(404).send()
        }
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/products/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'category', 'price']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

   
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }
    try {
        const product = await Product.findOne({ _id: req.params.id })

        if (!product) {
            return res.status(404).send()
        }
        updates.forEach((update) => {            
            product[update] = req.body[update]
        })
        
        await product.save()
        res.send(product)
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.delete('/products/:id', auth, async (req, res) => {
    try {
        //  const task = await Task.findByIdAndDelete(req.params.id)
        const product = await Product.findOneAndDelete({ _id: req.params.id})

        if (!product) {
            return res.status(404).send()
        }
        res.send(product)
    } catch (e) {
        return res.status(500).send(e)
    }
})


module.exports = router
