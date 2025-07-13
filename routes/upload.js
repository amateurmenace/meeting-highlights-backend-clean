// routes/upload.js

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const { processVideo } = require('../controllers/processVideo');

const router  = express.Router();

/** Multer storage: uploads/<timestamp>.ext */
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({ storage });

/** POST /upload  — single file field named "video" */
router.post('/upload', upload.single('video'), processVideo);

module.exports = router;