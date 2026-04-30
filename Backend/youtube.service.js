const ytdlExec = require('youtube-dl-exec');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

class YouTubeService {
    async getVideoInfo(url) {
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

        return {
            title: info.title,
            thumbnail: info.thumbnail,
            qualities: uniqueQualities,
            rawInfo: info
        };
    }

    async downloadVideoToTemp(url, heightStr, tempPath) {
        // Use ffmpeg to merge 1080p video and audio. 
        const formatSelector = `"bestvideo[ext=mp4][height<=${heightStr}]+bestaudio[ext=m4a]/best[ext=mp4][height<=${heightStr}]/best"`;
        const ffmpegPath = `"${ffmpegStatic}"`;

        // Download and merge to temp file
        await ytdlExec(url, {
            format: formatSelector,
            ffmpegLocation: ffmpegPath,
            o: `"${tempPath}"`,
        });
    }

    getAudioDownloadStream(url) {
        const subprocess = ytdlExec.exec(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            o: '-', // output to stdout
        });
        return subprocess;
    }
}

module.exports = new YouTubeService();
