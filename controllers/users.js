const { request, response } = require('express');

const getUsers = (req = request, res = response) => {

    const {q, apikey, page = '10', limit = '30'} = req.query

    res.json({
        msg: 'get API - from controller',
        q,
        apikey,
        page,
        limit
    });
}

const postUsers = (req, res = response) => {

    const {nombre, edad} = req.body

    res.json({
        msg: 'post API - from controller',
        nombre,
        edad
    });
}

const putUsers = (req, res = response) => {

    const {id} = req.params

    res.json({
        msg: 'put API - from controller',
        id
    });
}

const deleteUsers = (req, res = response) => {
    res.json({
        msg: 'delete API - from controller'
    });
}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers,
}