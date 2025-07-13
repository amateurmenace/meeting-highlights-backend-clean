// backend/server.js
const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/upload', uploadRoute);
app.use('/output', express.static('output'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
