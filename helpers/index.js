const dbValidators = require('./db-validators');
const fileUpload   = require('./file-upload');
const googleVerify = require('./google-verify');
const jwtChecker   = require('./jwt-checker');
const jwtGenerator = require('./jwt-generator');

module.exports = {
    ...dbValidators,
    ...fileUpload,
    ...googleVerify,
    ...jwtGenerator,
    ...jwtChecker,
}