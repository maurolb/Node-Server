const {Role} = require('../models');
const {User, Category, Product} = require('../models');

/**
 * Role
 */
const isValidRole = async(role = '') => {
    if(!role){
        throw new Error('Role filed cannot be empty');
    }
    const roleExists = await Role.findOne({role});
    if(!roleExists) {
        throw new Error(`The role '${role}' doesn't exist in the database`);
    }
}

/**
 * Email
 */
const emailExists = async (email = '') => {
    const emailExists = await User.findOne({email})
    if (emailExists) {
        throw new Error('Email already exists');
    }
}

/**
 * Usuarios
 */
const userIdExists = async (id) => {
    const user = await User.findById(id)
    if (!user) {
        throw new Error('User not found with that ID');
    }
}

/**
 * Categorías
 */
const categoryIdExists = async (id) => {
    const category = await Category.findById(id)
    if (!category) {
        throw new Error('Category not found with that ID');
    }
}

/**
 * Productos
 */
const productIdExists = async (id) => {
    const product = await Product.findById(id)
    if (!product) {
        throw new Error('Product not found with that ID');
    }
}

/**
 * Colecciones permitidas
 */
 const allowedCollections = async (collection = '', collections = []) => {
    const included = collections.includes(collection);
    if (!included) {
        throw new Error(`That collection is not allowed, allowed collections: ${collections}`);
    }
}

module.exports = {
    allowedCollections,
    categoryIdExists,
    emailExists,
    isValidRole,
    productIdExists,
    userIdExists,
}