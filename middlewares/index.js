const fieldsValidator = require('../middlewares/fields-validator');
const fileValidator   = require('../middlewares/file-validator');
const jwtValidator    = require('../middlewares/jwt-validator');
const roleValidator   = require('../middlewares/role-validator');

module.exports = {
    ...fieldsValidator,
    ...fileValidator,
    ...jwtValidator,
    ...roleValidator,
}