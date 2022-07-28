const { response } = require('express');
const bcrypt = require('bcryptjs');
const {User} = require('../models');
const { jwtGenerator } = require('../helpers/jwt-generator');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si existe el usuario
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                msg: 'Wrong User / Password - email'
            })
        }

        // Si el usuario está activo
        if(!user.state) {
            return res.status(400).json({
                msg: 'Wrong User / Password - state: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Wrong User / Password - password'
            })
        }

        // Generar el JWT
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

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;

    try {
        
        const {name, email, picture} = await googleVerify(id_token)
        
        let user = await User.findOne({email});

        if(!user){
            // Crear usuario
            const data = {
                name,
                email,
                password: 'asd',
                role: 'USER_ROLE',
                img: picture,
                google: true
            }

            user = new User(data);
            await user.save();
        }

        // Verificar el estado del usuario
        if(!user.state){
            return res.status(401).json({
                msg: 'Contact with the backend admin, blocked user'
            })
        }

        // Generar token
        const token = await jwtGenerator(user.id)
    
        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            mgs: 'Could not verify token'
        })
    }
}

const tokenRenew = async (req, res) => {
    const { user } = req; 

    // Generar el JWT
    const token = await jwtGenerator(user.id);

    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    tokenRenew
}