const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PythonShell } = require('python-shell');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = req.file.path;

  PythonShell.run('python/analyze.py', { args: [inputPath] }, (err, results) => {
    if (err) {
      console.error('❌ Python error:', err);
      return res.status(500).json({ error: 'Failed to process video' });
    }

    res.status(200).json({ success: true, results });
  });
});

module.exports = router;