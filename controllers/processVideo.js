const { spawn } = require('child_process');
const path = require('path');

const processVideo = (req, res) => {
  if (!req.file) {
    console.error("❌ No file received");
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const videoPath = req.file.path;
  console.log("📥 Received file:", videoPath);

  const scriptPath = path.join(__dirname, '../python/analyze.py');
  const filePath = req.file.path;
const python = spawn('/Users/amateurmenace/Documents/meeting-highlights-app/backend/python/venv/bin/python', ['python/analyze.py', filePath]);
  let data = '';
  python.stdout.on('data', (chunk) => (data += chunk.toString()));
  python.stderr.on('data', (err) =>
    console.error('🐍 Python stderr:', err.toString())
  );

  python.on('close', (code) => {
    console.log("🐍 Python script finished with code", code);
    try {
      const result = JSON.parse(data);
      res.json(result);
    } catch (err) {
      console.error("❌ JSON parsing error:", data);
      res.status(500).json({ error: 'Failed to analyze video' });
    }
  });
};
const fs = require("fs");
const path = require("path");

function createVTT(highlights, outputPath) {
  const vttLines = ["WEBVTT\n"];
  highlights.forEach((item, i) => {
    vttLines.push(`${i + 1}`);
    vttLines.push(`${item.start} --> ${item.end}`);
    vttLines.push(item.quote);
    vttLines.push(""); // blank line
  });

  fs.writeFileSync(outputPath, vttLines.join("\n"), "utf8");
}
module.exports = { processVideo };