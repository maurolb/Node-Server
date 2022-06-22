const fieldsValidator = require('../middlewares/fields-validator');
const jwtValidator = require('../middlewares/jwt-validator');
const roleValidator = require('../middlewares/role-validator');

module.exports = {
    ...fieldsValidator,
    ...jwtValidator,
    ...roleValidator,
}