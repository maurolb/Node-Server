const { Router } = require('express');
const { check } = require('express-validator');
const { postProduct, getProduct, getProducts, putProduct, deleteProduct } = require('../controllers/products');
const { productIdExists } = require('../helpers/db-validators');

const {fieldsValidator, jwtValidator, isAdminRole} = require('../middlewares');

const router = Router();

// Obtener todas los productos - público
router.get('/', getProducts);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productIdExists),
    fieldsValidator,
], getProduct);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    jwtValidator,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Invalid ID').isMongoId(),
    fieldsValidator
], postProduct);

// Actualizar producto - privado - cualquiera con token válido
router.put('/:id', [
    jwtValidator,
    // check('name', 'Name is required').not().isEmpty(),
    // check('category', 'Invalid ID').isMongoId(),
    check('id', 'Invalid ID').isMongoId(),
    // check('category').custom(productIdExists),
    check('id').custom(productIdExists),
    fieldsValidator,
], putProduct);

// Borrar producto - admin
router.delete('/:id', [
    jwtValidator,
    isAdminRole,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productIdExists),
    fieldsValidator,
], deleteProduct);



module.exports = router;