const express = require('express');
const cors = require('cors');
// const youtubeRoutes = require('../youtube.routes');
const youtubeRoutes = require('./youtube.routes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api', youtubeRoutes);

// Start the Express server
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
