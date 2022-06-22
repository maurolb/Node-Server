const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { jwtGenerator } = require('../helpers/jwt-generator');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar si existe el usuario
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                msg: 'Wrong User / Password - email'
            })
        }

        // si el usuario está activo
        if(!user.state) {
            return res.status(400).json({
                msg: 'Wrong User / Password - state: false'
            })
        }

        // verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Wrong User / Password - password'
            })
        }

        // generar el JWT
        const token = await jwtGenerator(user.id)

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contact with the backend admin'
        })
    }
}

module.exports = {
    login,
}