const Product = require('../models/product.model');
const logger = require('../utils/logger');

const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

let imagePath = path.join(__dirname, '../public/upload/productos');
const storage = multer.diskStorage({
    destination: imagePath,
    filename: (req, file, cb) => {
        cb(null,uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
    }   
});

const upload = multer({
    storage,
    dest: imagePath,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|JPEG|JPG|PNG/
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }else{
            req.validatorFile = {status:false, message: 'Error: File type not supported', type: path.extname(file.originalname)};
            cb(null, false, new Error('File type not supported'));
        }
    }
}).single('file');


module.exports = {
    getAll: (req, res) => {
        Product.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    addImage: (req, res) => {
        try {
            upload(req, res, (error) => {
                if(error){
                    res.status(500).json({status: false, message: error.message});
                }else{
                    res.status(200).json({status: true, message: 'File uploaded successfully', data: req.file});
                }
            });
        } catch (error) {
            logger.error(error);
            
        }
    },
    create: (req, res) => {
        let code = uuidv4();
        req.body.code = code.split('-')[0];
        req.body.uuid = code;
        Product.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    }
}