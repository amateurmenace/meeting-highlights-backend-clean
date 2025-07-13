// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { processVideo } = require('../controllers/processVideo');

const router = express.Router();

// Set up Multer to save uploaded files to /uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST route to accept uploaded video
router.post('/', upload.single('video'), processVideo);

module.exports = router;