

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

function startDownload() {
  const link = document.getElementById('ytLink').value.trim();
  const status = document.getElementById('statusMsg');
  const downloads = document.getElementById('downloadOptions');

  // Reset messages and hide buttons
  status.innerText = "";
  downloads.style.display = "none";

  // Validate YouTube link
  const isValid = link.includes("youtube.com/watch?v=") || link.includes("youtu.be/");

  if (!isValid) {
    status.innerText = "❌ Please enter a valid YouTube link.";
    return;
  }

  // Simulate processing delay
  status.innerText = "🔄 Processing your link...";
  setTimeout(() => {
    status.innerText = "✅ Link processed. Choose your format:";
    downloads.style.display = "flex";
  }, 1500);
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
  contactNav.addEventListener('click', function(e) {
    // Let scroll happen, then trigger shine after a short delay
    setTimeout(shineContactIcons, 600);
  });
}