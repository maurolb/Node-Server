const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, showImg, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
const { fieldsValidator, fileValidator } = require('../middlewares');

const router = Router();

router.post('/', fileValidator, uploadFile);

router.put('/:collection/:id', [
    fileValidator,
    check('id', 'Invalid ID').isMongoId(),
    check('collection').custom( collection => allowedCollections( collection, ['users', 'products'] )),
    fieldsValidator,
], updateImageCloudinary);

router.get('/:collection/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('collection').custom( collection => allowedCollections( collection, ['users', 'products'] )),
    fieldsValidator,
], showImg);


module.exports = router;