const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', uploadRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});