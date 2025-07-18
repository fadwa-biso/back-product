const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require("path");


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf','.jpg','.jpeg','.png'];
    const ext = path.extname(file.originalname).toLowerCase();

    if(allowedTypes.includes(ext)) {
        cb(null, true);
    }else{
        cb(new Error('Only .pdf, .jpg, .jpeg, and .png files are allowed!'), false);
    }
};

const limits={
    fileSize: 5*1024*1024,
};

// Cloudinary storage configuration
// This will store the files in Cloudinary under the specified folder and with a unique public ID
// You can adjust the folder name and allowed formats as needed
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'medical-reports', // Folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({
    fileFilter,
    limits,
    storage
});

module.exports = upload;