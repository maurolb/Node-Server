const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { fileUpload } = require("../helpers");
const { User, Product } = require("../models");

const uploadFile = async (req, res = response) => {

    try {

        // Imagenes
        const name = await fileUpload(req.files, undefined, 'images')
        res.json({ name })

    } catch (msg) {
        res.status(400).json({msg})
    }

}

const updateImage = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'User not found with that ID'
                })
            }
        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'Product not found with that ID'
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    // Limpiar imágenes previas
    if (model.img){
        // borrar la imagen del servidor
        const imgPath = path.join(__dirname, '../uploads', collection, model.img);
        if( fs.existsSync(imgPath)){
            fs.unlinkSync(imgPath)
        }
    }

    const name = await fileUpload(req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json({
        model
    })

}


const updateImageCloudinary = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'User not found with that ID'
                })
            }
        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'Product not found with that ID'
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    // Limpiar imágenes previas
    if (model.img){
        const nameArray = model.img.split('/');
        const name = nameArray[nameArray.length -1];
        const [public_id] = name.split('.');
        const path = collection + "/" + public_id
        cloudinary.uploader.destroy(path);
    }

    const {tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath, {
        folder: collection,
    });
    model.img = secure_url;

    await model.save();

    res.json(model)

}


const showImg = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'User not found with that ID'
                })
            }
        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: 'Product not found with that ID'
                })
            }
        break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    if (model.img){
        /* Traer imagen desde el propio servidor
        const imgPath = path.join(__dirname, '../uploads', collection, model.img);
        if( fs.existsSync(imgPath)){
            return res.sendFile(imgPath)
        }
        */

        // mostrar imagen desde cloudinary
        return res.redirect(model.img)

        // mostrar link desde cloudinary
        // return res.json(model.img)
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
}

module.exports = {
    showImg,
    updateImage,
    updateImageCloudinary,
    uploadFile,
}