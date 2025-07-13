// controllers/processVideo.js

const { spawn } = require('child_process');
const path  = require('path');
const fs    = require('fs');

/**
 * POST /upload handler
 * Expects req.file (set by multer)
 * Runs python/analyze.py <filePath>
 * Returns JSON { summary, highlights, ... }
 */
const processVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;           // e.g., uploads/12345.mp4
  console.log('📥 Received file:', filePath);

  // Call python3 that exists in the Docker image
  const python = spawn('python3', ['python/analyze.py', filePath]);

  let stdout = '';
  let stderr = '';

  python.stdout.on('data', chunk => (stdout += chunk.toString()));
  python.stderr.on('data',  err   => (stderr += err.toString()));

  python.on('close', code => {
    if (code !== 0) {
      console.error('🐍 Python error:\n', stderr);
      return res.status(500).json({ error: 'Failed to process video' });
    }

    try {
      const result = JSON.parse(stdout);
      return res.json(result);
    } catch (e) {
      console.error('❌ JSON parse error:', e);
      return res.status(500).json({ error: 'Invalid JSON from analyzer' });
    }
  });
};

module.exports = { processVideo };