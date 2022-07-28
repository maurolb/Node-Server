const User = require("../models/user")
const jwt = require('jsonwebtoken');

const jwtChecker = async (token = '') => {
    try {
        if(token.length < 10){
            return null
        }
        
        const {uid} = jwt.verify(token, process.env.SECRETKEY)
        const user = await User.findById(uid)

        if(user){
            if(user.state){
                return user
            } else {
                return null
            }
        } else {
            return null
        }

    } catch (error) {
        return null
    }
}

module.exports = {
    jwtChecker,
}