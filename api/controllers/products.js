const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res) => {
    Product.find({})
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: `http://${req.get('host')}/products/${doc._id}`
                        }
                    }
                })
            }
            // if(docs.length >= 0) {
                res.status(200).json(response);
            // } else {
            //     res.status(404).json({message: "No entry found"});
            // }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

exports.products_create_product = (req, res) => {
    console.log(req.file)
    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    newProduct   
        .save()
        .then( result => {
            res.status(201).json({
                message: "Created product successfully",
                created: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: `http://${req.get('host')}/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

exports.products_get_id = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then( doc => {
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: "No valid entry found for provided ID"});
            }
        })
        .catch( err =>{
            res.status(500).json({error: err});
        });
};

exports.products_update_product = (req, res) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product successfully updated',
                ok: result.ok
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

exports.products_delete_product = (req, res) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product successfully deleted",
                ok: result.ok,
                deletedCount: result.deletedCount
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};