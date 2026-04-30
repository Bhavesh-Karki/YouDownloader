const express = require('express');
const router = express.Router();
const youtubeController = require('./youtube.controller');

// 1. Endpoint to validate and fetch basic video info
router.get('/info', youtubeController.getInfo.bind(youtubeController));

// 2. Endpoint to Download Video (MP4)
router.get('/download/video', youtubeController.downloadVideo.bind(youtubeController));

// 3. Endpoint to Download Audio (MP3)
router.get('/download/audio', youtubeController.downloadAudio.bind(youtubeController));

module.exports = router;
