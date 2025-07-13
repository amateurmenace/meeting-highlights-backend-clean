const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
  if (!req.files || !req.files.video) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const video = req.files.video;
  const uploadPath = path.join(__dirname, '..', 'uploads', `${Date.now()}.mp4`);

  video.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).json({ error: 'Failed to save video' });
    }

    let options = {
      mode: 'text',
      pythonOptions: ['-u'],
      args: [uploadPath]
    };

    PythonShell.run('python/analyze.py', options, (err, results) => {
      if (err) {
        console.error('Error executing Python script:', err);
        return res.status(500).json({ error: 'Failed to process video' });
      }

      res.json({
        status: 'success',
        message: 'Video processed successfully',
        highlights: results
      });
    });
  });
});

module.exports = router;