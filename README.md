# YouDownloader

YouDownloader is a simple YouTube downloader web app with a separate frontend and backend. It lets users paste a YouTube link, fetch the video details, and download either MP4 video files in available qualities or MP3 audio only.

## Features

- Paste a valid YouTube video or Shorts link to load download options.
- View available MP4 qualities returned by the backend.
- Download audio as MP3.
- See a recent downloads history stored in the browser.
- Responsive interface with a guide modal and contact links.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Download tooling: youtube-dl-exec, ffmpeg-static
- UI extras: Font Awesome

## Project Structure

- Frontend/ - Main user interface
- Backend/ - Express API server
- Asset/ - Images and logo files

## Setup

### 1. Install dependencies

Open a terminal in the project folder and install backend dependencies:

```bash
cd Backend
npm install
```

### 2. Start the backend

Run the API server on port 3000:

```bash
node server.js
```

### 3. Open the frontend

Open Frontend/index.html in your browser, or serve the Frontend/ folder with your preferred local server.

## API Endpoints

- GET /api/info?url=... - Fetch video metadata and available MP4 qualities.
- GET /api/download/video?url=...&quality=720p - Download a video in the selected quality.
- GET /api/download/audio?url=... - Download audio as MP3.

## Notes

- The app expects valid YouTube links.
- Download availability depends on the source video and YouTube restrictions.
- The frontend uses http://localhost:3000 for API requests, so the backend must be running before downloads will work.

## Contact

Created by Bhavesh Karki.
