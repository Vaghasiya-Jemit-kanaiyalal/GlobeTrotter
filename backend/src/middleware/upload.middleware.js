const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');

// Ensure upload folders exist
const profileDir = path.join(__dirname, '../../', config.uploadDir, 'profiles');
const tripDir = path.join(__dirname, '../../', config.uploadDir, 'trips');

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}
if (!fs.existsSync(tripDir)) {
  fs.mkdirSync(tripDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileImage' || file.fieldname === 'avatar') {
      cb(null, profileDir);
    } else {
      cb(null, tripDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
