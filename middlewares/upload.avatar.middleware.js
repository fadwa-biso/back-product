const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'RxCure/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => `avatar-${Date.now()}-${file.originalname}`
    }
});

const uploadAvatar = multer({ storage: avatarStorage });

module.exports = uploadAvatar;
