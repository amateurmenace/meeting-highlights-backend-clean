const { PythonShell } = require("python-shell");

function processVideo(req, res) {
  if (!req.file) {
    console.log("❌ No file uploaded.");
    return res.status(400).json({ error: "No video uploaded" });
  }

  const filePath = req.file.path;
  console.log("📥 Received file:", filePath);

  const options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "./python",
    args: [filePath],
  };

  PythonShell.run("analyze.py", options)
    .then((results) => {
      console.log("✅ Python script output:", results);

      const summaryJson = results?.[0];
      const parsed = JSON.parse(summaryJson);
      res.json(parsed);
    })
    .catch((err) => {
      console.error("🐍 Python script error:", err);
      res.status(500).json({ error: "Failed to process video" });
    });
}