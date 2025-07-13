const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadRoute = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 8080;

// Ensure uploads folder exists at runtime
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use("/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});