const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { login, googleSignIn, tokenRenew } = require('../controllers/auth');
const { jwtValidator } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    fieldsValidator,
], login);

router.post('/google', [
    check('id_token', 'ID token is required').not().isEmpty(),
    fieldsValidator,
], googleSignIn);

router.get('/', jwtValidator, tokenRenew)

module.exports = router;