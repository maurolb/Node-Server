const { request, response } = require('express');
const {Product} = require('../models');

const getProducts = async(req = request, res = response) => {

    const {limit = 5, init = 0} = req.query;
    const query = {state: true};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('user', 'name')
        .populate('category', 'name')
        .skip(Number(init))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        products,
    });
}

const getProduct = async(req = request, res = response) => {

    const {id} = req.params;
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

    res.json(product);
}

const postProduct = async (req, res = response) => {

    const {state, user, ...body} = req.body;
    
    const productDB = await Product.findOne({name: body.name});

    if(productDB){
        return res.status(400).json({
            msg: 'This product already exists in the database'
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product(data);
    
    // Guardar
    await product.save();

    res.status(201).json(product);
}

const putProduct = async(req, res = response) => {
    
    const {id} = req.params
    const {state, user, ...data} = req.body

    if(data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {new: true})

    res.json(updatedProduct);
}

const deleteProduct = async(req, res = response) => {

    const {id} = req.params

    const deletedProduct = await Product.findByIdAndUpdate(id, {state: false}, {new: true})

    res.json(deletedProduct);
}

module.exports = {
    getProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct,
}