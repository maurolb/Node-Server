const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async(role = '') => {
    if(!role){
        throw new Error('Role filed cannot be empty');
    }
    const roleExists = await Role.findOne({role});
    if(!roleExists) {
        throw new Error(`The role '${role}' doesn't exist in the database`);
    }
}

const emailExists = async (email = '') => {
    const emailExists = await User.findOne({email})
    if (emailExists) {
        throw new Error('Email already exists');
    }
}

const userIdExists = async (id) => {
    const user = await User.findById(id)
    if (!user) {
        throw new Error('User not found with that ID');
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userIdExists
}