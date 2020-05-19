const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res) => {
    Order.find({})
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json(docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: `http://${req.get('host')}/orders/${doc._id}`
                    }
                }
            }));
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not fond'
                });
            }
            const newOrder = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });  
            return newOrder
                .save()
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity                    
                },
                request: {
                    type: 'GET',
                    url: `http://${req.get('host')}/orders/${result._id}`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not fond'
            });
        })
});

router.get('/:orderId', (req, res) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(order => {
            if(!order) {
                res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json(order);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.delete('/:orderId', (req, res) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Orders deleted',
                ok: result.ok,
                deletedCount: result.deletedCount
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

module.exports = router;