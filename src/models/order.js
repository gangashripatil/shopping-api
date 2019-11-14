const mongoose = require('mongoose')
const Product = require('./product')


const orderSchema = new mongoose.Schema({
    items: [{
        product_id: {            
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: async function (_id) {
                const result = await Product.findById(_id)
               if(!result){
                    throw new Error('Invalid Product Selected')
               }               
            }
        },
        quantity:{
            type: Number,
            require: true
        }
    }],	
    totalItems: {
        type: Number,
        require: true,
    },
    totalCost: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
        trim: true
    },
    orderDate: {
        type: String,
        require: true,
        trim: true
    },    
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order

