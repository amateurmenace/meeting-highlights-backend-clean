const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

exports.processVideo = async (req, res) => {
  try {
    console.log("Received file:", req.file?.path);
    const filePath = req.file.path;

    exec(`python3 python/analyze.py "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error executing Python script:", error);
        return res.status(500).json({ error: "Failed to process video" });
      }

      console.log("🐍 Python stderr:", stderr);
      console.log("🐍 Python stdout:", stdout);

      try {
        const result = JSON.parse(stdout);
        if (result?.highlights?.length > 0) {
          const latest = result.highlights[result.highlights.length - 1];
          const fileName = latest.file?.split("/").pop();
          result.downloadLink = `/output/${fileName}`;
        }
        res.json(result);
      } catch (parseError) {
        console.error("❌ JSON parsing error:", parseError);
        res.status(500).json({ error: "Failed to parse output" });
      }
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
};