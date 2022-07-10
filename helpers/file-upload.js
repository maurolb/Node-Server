const path = require('path');
const { v4: uuidv4 } = require('uuid');


const fileUpload = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {
        const {file} = files;
        const splitedFile = file.name.split('.');
        const extension = splitedFile[splitedFile.length -1]


        // Validar extensión
        if(!validExtensions.includes(extension)){
            return reject('Invalid extension, allowed files are: ' + validExtensions)
        }

        const fileName = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', folder, fileName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            resolve(fileName)
        });
    });

}

module.exports = {
    fileUpload,
}