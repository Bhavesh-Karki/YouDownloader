const youtubeService = require('./youtube.service');
const { isYouTubeUrl } = require('./validation');
const fs = require('fs');
const path = require('path');

class YouTubeController {
    async getInfo(req, res) {
        try {
            const url = req.query.url;
            if (!isYouTubeUrl(url)) {
                return res.status(400).json({ error: 'Invalid YouTube URL' });
            }

            const info = await youtubeService.getVideoInfo(url);

            res.json({
                success: true,
                title: info.title,
                thumbnail: info.thumbnail,
                qualities: info.qualities
            });
        } catch (error) {
            console.error("Error fetching info:", error.message);
            res.status(500).json({ error: 'Failed to fetch video info. It may be restricted.' });
        }
    }

    async downloadVideo(req, res) {
        try {
            const { url, quality } = req.query;

            if (!isYouTubeUrl(url)) {
                return res.status(400).send('Invalid YouTube URL');
            }

            const info = await youtubeService.getVideoInfo(url);
            const title = info.title.replace(/[^\w\s]/gi, '');

            let heightStr = quality ? quality.replace('p', '') : '720';

            const tempFilename = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp4`;
            const tempPath = path.resolve(__dirname, '..', tempFilename);

            await youtubeService.downloadVideoToTemp(url, heightStr, tempPath);

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
    }

    async downloadAudio(req, res) {
        try {
            const { url } = req.query;

            if (!isYouTubeUrl(url)) {
                return res.status(400).send('Invalid YouTube URL');
            }

            const info = await youtubeService.getVideoInfo(url);
            const title = info.title.replace(/[^\w\s]/gi, '');

            // Set headers for MP3 download
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

            const subprocess = youtubeService.getAudioDownloadStream(url);

            subprocess.stdout.pipe(res);

            subprocess.on('error', (err) => {
                console.error("yt-dlp audio error:", err);
                if (!res.headersSent) res.status(500).send("Error downloading audio.");
            });

        } catch (error) {
            console.error("Download setup error:", error.message);
            if (!res.headersSent) res.status(500).send('Failed to process download');
        }
    }
}

module.exports = new YouTubeController();
