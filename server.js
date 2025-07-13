const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/', uploadRoutes); // Mount upload routes at root

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
