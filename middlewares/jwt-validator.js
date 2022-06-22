const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtValidator = async(req, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Token is required in the request'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETKEY);

        // leer el usuario que corresponde al uid
        const user = await User.findById(uid)

        if(!user){
            return res.status(401).json({
                msg: 'You can not do that - This user has recently been deleted from the database'
            });
        }

        // verificar que el usuario tenga el state true
        if(!user.state){
            return res.status(401).json({
                msg: 'Invalid token - user with state: false'
            });
        }

        req.user = user

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }

}

module.exports = {
    jwtValidator,
}