const express = require('express');
const fileUpload = require('express-fileupload');
const uploadRoute = require('./routes/upload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(fileUpload());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.use('/upload', uploadRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});