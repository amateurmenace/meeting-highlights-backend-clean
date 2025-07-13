const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 8080;

// Make sure uploads/ directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use('/', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});