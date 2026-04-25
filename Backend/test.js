const yt = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const ffmpegPath = `"${require('ffmpeg-static')}"`;
const tempFilename = `temp_${Date.now()}.mp4`;
const tempPath = path.resolve(__dirname, tempFilename);

console.log('ffmpegPath:', ffmpegPath);
console.log('tempPath:', `"${tempPath}"`);

yt('https://youtu.be/CoNwp0gNEr4', {
    format: '"bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4][height<=1080]/best"',
    ffmpegLocation: ffmpegPath,
    o: `"${tempPath}"`
}).then(() => console.log('success')).catch(e => console.error(e.message));
