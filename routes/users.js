const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, postUsers, putUsers, deleteUsers } = require('../controllers/users');
const { isValidRole, emailExists, userIdExists } = require('../helpers/db-validators');

const {fieldsValidator, jwtValidator, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

router.get('/', getUsers);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invail email').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password must be at least 6 characters').isLength({min: 6}),
    // check('role', 'Invalid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    fieldsValidator,
], postUsers);

router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userIdExists),
    check('role').custom(isValidRole),
    fieldsValidator,
], putUsers);

router.delete('/:id', [
    jwtValidator,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userIdExists),
    fieldsValidator,
], deleteUsers);

module.exports = router;