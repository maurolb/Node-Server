const { request, response } = require('express');
const {Category} = require('../models');

const getCategories = async(req = request, res = response) => {

    const {limit = 5, init = 0} = req.query;
    const query = {state: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate('user', 'name')
        .skip(Number(init))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        categories,
    });
}

const getCategory = async(req = request, res = response) => {

    const {id} = req.params
    const category = await Category.findById(id).populate('user', 'name')

    res.json({
        category
    });
}

const postCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({name});

    if(categoryDB){
        return res.status(400).json({
            msg: 'This category already exists in the database'
        })
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id,
    }

    const category = new Category(data);
    
    // Guardar
    await category.save();

    res.status(201).json(category);
}

const putCategory = async(req, res = response) => {
    
    const {id} = req.params
    const {state, user, ...data} = req.body

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const updatedCategory = await Category.findByIdAndUpdate(id, data, {new: true})

    res.json(updatedCategory);
}

const deleteCategory = async(req, res = response) => {

    const {id} = req.params

    const deletedCategory = await Category.findByIdAndUpdate(id, {state: false}, {new: true})

    res.json(deletedCategory);
}

module.exports = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    deleteCategory,
}