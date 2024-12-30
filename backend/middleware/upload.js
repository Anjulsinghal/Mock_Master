const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mock_master_profile_pictures', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage });

module.exports = upload;
