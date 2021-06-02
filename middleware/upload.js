const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yelpcamp',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

module.exports = multer({ storage: storage });
