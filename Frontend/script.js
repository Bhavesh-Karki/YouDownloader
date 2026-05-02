

// Function to open the modal
function openmodal() {
  document.getElementById('aboutModal').style.display = 'block';
}

// // Function to close the modal
function closemodal() {
  document.getElementById('aboutModal').style.display = 'none';
}



const texts = [
  "You Can Download "
];

const dynamicTexts = [
  "YouTube Video",
  "YouTube Shorts"
];

let currentText = 0;
let currentChar = 0;
let isErasing = false;
const typingElement = document.getElementById("typing");

function type() {
  if (!isErasing) {
    if (currentChar < dynamicTexts[currentText].length) {
      typingElement.textContent = texts[0] + dynamicTexts[currentText].substring(0, currentChar + 1);
      currentChar++;
      setTimeout(type, 150); // Typing speed
    } else {
      isErasing = true;
      setTimeout(erase, 1000); // Wait before starting to erase
    }
  }
}

function erase() {
  if (currentChar > 0) {
    typingElement.textContent = texts[0] + dynamicTexts[currentText].substring(0, currentChar - 1);
    currentChar--;
    setTimeout(erase, 100); // Erasing speed
  } else {
    isErasing = false;
    currentText = (currentText + 1) % dynamicTexts.length; // Toggle between "YouTube Video" and "YouTube Shorts"
    setTimeout(type, 500); // Wait before typing again
  }
}

// Start the typing animation
type();

// History Management
// document.addEventListener('DOMContentLoaded', loadHistory);

// function loadHistory() {
//   const history = JSON.parse(localStorage.getItem('ytHistory')) || [];
//   const historySection = document.getElementById('historySection');
//   const historyList = document.getElementById('historyList');

//   if (history.length === 0) {
//     historySection.style.display = 'none';
//     return;
//   }

//   historySection.style.display = 'block';
//   historyList.innerHTML = '';

//   // Show up to 10 recent downloads
//   history.slice(0, 10).forEach(item => {
//     const li = document.createElement('li');
//     li.style.padding = '10px 0';
//     li.style.borderBottom = '1px solid #eee';
//     li.style.display = 'flex';
//     li.style.justifyContent = 'space-between';
//     li.style.alignItems = 'center';
//     li.style.color = '#333';
//     li.style.fontSize = '15px';

//     li.innerHTML = `
//       <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;" title="${item.title}">${item.title}</span>
//       <span style="font-size: 0.85em; background: #e9e0f5; color: #4b3b73; padding: 4px 10px; border-radius: 20px; font-weight: bold;">${item.quality}</span>
//     `;
//     historyList.appendChild(li);
//   });
// }

// function saveToHistory(title, quality) {
//   let history = JSON.parse(localStorage.getItem('ytHistory')) || [];

//   // Remove duplicate if it exists to push it to the top
//   history = history.filter(h => !(h.title === title && h.quality === quality));

//   history.unshift({ title, quality, date: new Date().toISOString() });

//   // Keep max 20 items
//   history = history.slice(0, 20);
//   localStorage.setItem('ytHistory', JSON.stringify(history));

//   // Re-render
//   loadHistory();
// }

const API_BASE_URL = 'https://youdownloader-production-ca85.up.railway.app';

async function startDownload() {
  const link = document.getElementById('ytLink').value.trim();
  const status = document.getElementById('statusMsg');
  const downloads = document.getElementById('downloadOptions');

  // Reset messages and hide buttons
  status.innerText = "";
  downloads.style.display = "none";
  // Clear previous dynamically added links
  downloads.innerHTML = '';

  // Validate YouTube link
  const isValid = link.includes("youtube.com/watch?v=") || link.includes("youtu.be/") || link.includes("youtube.com/shorts/");

  if (!isValid) {
    status.innerText = "❌ Please enter a valid YouTube link.";
    return;
  }

  status.innerText = "🔄 Fetching video info from server...";

  try {
    // 1. Call our backend API to fetch info
    const response = await fetch(`${API_BASE_URL}/api/info?url=${encodeURIComponent(link)}`);
    const data = await response.json();

    if (data.success) {
      status.innerText = `✅ Found: "${data.title}". Choose your format:`;

      // 2. Dynamically create download buttons for all available qualities
      if (data.qualities && data.qualities.length > 0) {
        data.qualities.forEach(quality => {
          const a = document.createElement('a');
          a.href = `${API_BASE_URL}/api/download/video?url=${encodeURIComponent(link)}&quality=${quality}`;
          a.innerHTML = `<i class="fa-regular fa-file-video"></i> Download MP4 (${quality})`;
          a.onclick = () => saveToHistory(data.title, `MP4 - ${quality}`);
          downloads.appendChild(a);
        });
      }

      // Add the MP3 Audio Only option at the end
      const audioLink = document.createElement('a');
      audioLink.href = `${API_BASE_URL}/api/download/audio?url=${encodeURIComponent(link)}`;
      audioLink.innerHTML = `<i class="fa-regular fa-file-audio"></i> Download MP3 (Audio Only)`;
      audioLink.onclick = () => saveToHistory(data.title, `MP3`);
      downloads.appendChild(audioLink);

      downloads.style.display = "flex";
    } else {
      status.innerText = `❌ Error: ${data.error || 'Failed to fetch video'}`;
    }
  } catch (error) {
    status.innerText = "❌ Error connecting to the backend server. Please try again later.";
    console.error(error);
  }
}

// function scrollToDownload(){
//     const section = document.getElementById("DownloadSection");
//     section.scrollIntoView({behavior:"smooth", block:"center"});
//     section.classList.add("highlight-DownlaodSection");
//     setTimeout(() =>{
//         section.classList.remove("highlight-DownloadSecton");
//     },1000);
// }

// Add shine effect to contact icons after scrolling to ContactMe
function shineContactIcons() {
  const icons = document.querySelectorAll('.ICON');
  icons.forEach(icon => {
    icon.classList.add('shine');
  });
  setTimeout(() => {
    icons.forEach(icon => {
      icon.classList.remove('shine');
    });
  }, 850); // slightly longer than animation
}

// Attach shine effect to Contact nav link
const contactNav = document.querySelector('a[href="#ContactMe"]');
if (contactNav) {
  contactNav.addEventListener('click', function (e) {
    // Let scroll happen, then trigger shine after a short delay
    setTimeout(shineContactIcons, 600);
  });
}