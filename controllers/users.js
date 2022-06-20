const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async(req = request, res = response) => {

    const {limit = 5, init = 0} = req.query;
    const query = {state: true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(init))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const postUsers = async (req, res = response) => {

    const {name, email, password, role} = req.body
    const user = new User({
        name,
        email,
        password,
        role
    });

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt)

    // guardar en db
    await user.save();
    
    res.json({
        user
    });
}

const putUsers = async(req, res = response) => {

    const {id} = req.params
    const { _id, password, google, email, ...rest} = req.body;

    // validar contra la base de datos
    if(password){
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt)
    }
    const user = await User.findByIdAndUpdate(id, rest, {new:true})

    res.json({
        user
    });
}

const deleteUsers = async(req, res = response) => {

    const {id} = req.params

    const deletedUser = await User.findByIdAndUpdate(id, {state: false})
    res.json({
        deletedUser
    });
}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers,
}