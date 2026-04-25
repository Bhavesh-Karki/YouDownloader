const express = require('express');
const cors = require('cors');
const ytdlExec = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to validate basic YouTube URL visually
function isYouTubeUrl(url) {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * 1. Endpoint to validate and fetch basic video info
 */
app.get('/api/info', async (req, res) => {
    try {
        const url = req.query.url;
        if (!isYouTubeUrl(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        
        // Fetch video metadata and formats using yt-dlp wrapper
        const info = await ytdlExec(url, {
            dumpJson: true,
            noWarnings: true
        });
        
        // Extract all available video qualities (heights)
        const videoFormats = info.formats.filter(f => f.vcodec !== 'none' && f.height);
        
        // Get unique resolutions (e.g., '144p', '360p', '1080p')
        const uniqueHeights = [...new Set(videoFormats.map(f => f.height))];
        const uniqueQualities = uniqueHeights.sort((a, b) => a - b).map(h => `${h}p`);

        res.json({ 
            success: true, 
            title: info.title,
            thumbnail: info.thumbnail,
            qualities: uniqueQualities
        });
    } catch (error) {
        console.error("Error fetching info:", error.message);
        res.status(500).json({ error: 'Failed to fetch video info. It may be restricted.' });
    }
});

/**
 * 2. Endpoint to Download Video (MP4)
 */
app.get('/api/download/video', async (req, res) => {
    try {
        const { url, quality } = req.query;
        
        if (!isYouTubeUrl(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        // Fetch basic info just to get the title
        const info = await ytdlExec(url, { dumpJson: true, noWarnings: true });
        const title = info.title.replace(/[^\w\s]/gi, ''); 

        let heightStr = quality ? quality.replace('p', '') : '720';
        
        // Use ffmpeg to merge 1080p video and audio. 
        // We must download to a temporary file first because MP4 cannot be merged on-the-fly to stdout.
        const formatSelector = `"bestvideo[ext=mp4][height<=${heightStr}]+bestaudio[ext=m4a]/best[ext=mp4][height<=${heightStr}]/best"`;
        const ffmpegPath = `"${require('ffmpeg-static')}"`;
        
        const fs = require('fs');
        const path = require('path');
        const tempFilename = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp4`;
        const tempPath = path.resolve(__dirname, tempFilename);

        // Download and merge to temp file
        await ytdlExec(url, {
            format: formatSelector,
            ffmpegLocation: ffmpegPath,
            o: `"${tempPath}"`,
        });

        // Send the fully merged high-quality file to the user
        res.download(tempPath, `${title}_${quality || 'video'}.mp4`, (err) => {
            // Cleanup: delete the temp file after sending
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        });

    } catch (error) {
        console.error("Download setup error:", error.message);
        if (!res.headersSent) res.status(500).send('Failed to process download');
    }
});

/**
 * 3. Endpoint to Download Audio (MP3)
 */
app.get('/api/download/audio', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!isYouTubeUrl(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdlExec(url, { dumpJson: true, noWarnings: true });
        const title = info.title.replace(/[^\w\s]/gi, ''); 

        // Set headers for MP3 download
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

        const subprocess = ytdlExec.exec(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            o: '-', // output to stdout
        });

        subprocess.stdout.pipe(res);

        subprocess.on('error', (err) => {
            console.error("yt-dlp audio error:", err);
            if (!res.headersSent) res.status(500).send("Error downloading audio.");
        });

    } catch (error) {
        console.error("Download setup error:", error.message);
        if (!res.headersSent) res.status(500).send('Failed to process download');
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
