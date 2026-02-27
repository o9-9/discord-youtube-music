# 🎵 YouTube Music Discord Rich Presence

This is a browser extension and desktop bridge application that displays the songs you're listening to on YouTube Music in real-time on your Discord profile.

![Discord Presence](https://img.shields.io/badge/Discord-Rich%20Presence-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![YouTube Music](https://img.shields.io/badge/YouTube%20Music-Streaming-FF0000?style=for-the-badge&logo=youtube-music&logoColor=white)

## ✨ Features

- 🎶 **Instant Synchronization:** Your Discord status updates within seconds when the song changes.
- 🖼️ **Album Covers:** The album cover of the song you're listening to is displayed on Discord.
- ⏯️ **Status Indicators:** Icons showing whether the song is playing or paused.
- 🕒 **Timer:** Live timer showing how long the song has been playing.
- 🎨 **Modern Interface:** An easy-to-use and stylish control panel.
- 🚀 **Low Resource Usage:** Runs silently and lightly in the background.

## 🚀 Installation

### 1. Desktop Application (Bridge)
This application transmits information from the browser to Discord.

1. Go to the `discord-app` folder.
2. Run the `QUICK-SETUP.bat` file.
3. The necessary dependencies will be automatically installed and the application will launch.

### 2. Chrome Extension
This extension extracts song information from the YouTube Music webpage.

1. Go to `chrome://extensions/` in your browser (Chrome, Edge, Brave, etc.).
2. Activate **Developer Mode** in the upper right corner.
3. Click the **Install unpacked item** button.
4. Select the **main folder** of this project.

## 🛠️ Usage

1. First, launch the desktop application (`discord-app/QUICK-SETUP.bat` or `START.bat` in the main folder).
2. Open YouTube Music and start a song.
3. Check that the song information appears on your Discord profile!

## 🔧 Configuration

If you want to use your own Discord application:
1. Create a new application via the [Discord Developer Portal](https://discord.com/developers/applications).
2. Paste your own `Application ID` into the `CLIENT_ID` variable in the `discord-app/main.js` file.

## 🤝 Contributing
Hata bildirimleri ve özellik önerileri için Issue açabilir veya Pull Request gönderebilirsiniz.

## ⚖️ Lisans


Bu proje Apache 2.0 lisansı ile lisanslanmıştır.
