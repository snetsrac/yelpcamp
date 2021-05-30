const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

module.exports = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yelpcamp',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});
