const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/', uploadRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});