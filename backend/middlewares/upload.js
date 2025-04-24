const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Ensure the upload directory exists
const productImagesDir = path.join(__dirname, '../assets/productImages');
fs.ensureDirSync(productImagesDir);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImagesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with uuid
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filter allowed file types
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: fileFilter
});

module.exports = upload; 