const dbValidators = require('./db-validators');
const fileUpload   = require('./file-upload');
const googleVerify = require('./google-verify');
const jwtGenerator = require('./jwt-generator');

module.exports = {
    ...dbValidators,
    ...fileUpload,
    ...googleVerify,
    ...jwtGenerator,
}