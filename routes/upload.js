const express = require('express');
const multer = require('multer');
const path = require('path');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;
  console.log(`Received file: ${videoPath}`);

  const options = {
    args: [videoPath],
    pythonOptions: ['-u'],
  };

  PythonShell.run('python/analyze.py', options, function (err, results) {
    if (err) {
      console.error('❌ Error executing Python script:', err);
      return res.status(500).json({ error: 'Failed to process video' });
    }

    console.log('✅ Python script results:', results);
    res.json({ success: true, output: results });
  });
});

router.get('/test', (req, res) => {
  res.send('Upload route is working!');
});

module.exports = router;