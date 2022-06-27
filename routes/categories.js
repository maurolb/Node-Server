const { Router } = require('express');
const { check } = require('express-validator');
const { postCategory, getCategory, getCategories, putCategory, deleteCategory } = require('../controllers/categories');
const { categoryIdExists } = require('../helpers/db-validators');

const {fieldsValidator, jwtValidator, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// Obtener todas las categorias - público
router.get('/', getCategories);

// Obtener una categoria por id - público
router.get('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryIdExists),
    fieldsValidator,
], getCategory);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
    jwtValidator,
    check('name', 'Name is required').not().isEmpty(),
    fieldsValidator
], postCategory);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    jwtValidator,
    check('name', 'Name is required').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryIdExists),
    fieldsValidator,
], putCategory);

// Borrar categoría - admin
router.delete('/:id', [
    jwtValidator,
    isAdminRole,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryIdExists),
    fieldsValidator,
], deleteCategory);



module.exports = router;