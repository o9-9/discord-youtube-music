const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const DiscordRPC = require('discord-rpc');
const express = require('express');
const cors = require('cors');

// Discord Application ID
let CLIENT_ID = '1461815607673749504';

let tray = null;
let mainWindow = null;
let rpc = null;
let isConnected = false;
let currentSong = null;
let server = null;

let PORT = 6470;
const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

async function findAvailablePort(startPort) {
  const net = require('net');

  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(startPort, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });

    server.on('error', () => {
      // Port dolu, bir sonrakini dene
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

expressApp.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connected: isConnected,
    user: isConnected ? rpc.user.username : null,
    timestamp: new Date().toISOString()
  });
});

expressApp.get('/test', (req, res) => {
  res.json({
    message: 'Bridge çalışıyor!',
    port: PORT,
    discord: isConnected ? 'Bağlı' : 'Bağlı değil'
  });
});

expressApp.post('/update', async (req, res) => {
  if (!isConnected || !rpc) {
    return res.status(503).json({
      error: 'Discord\'a bağlı değil',
      connected: false,
      success: false
    });
  }

  try {
    const { title, artist, isPlaying, albumArt } = req.body;

    if (!title || !artist) {
      return res.status(400).json({
        error: 'Şarkı bilgileri eksik',
        success: false
      });
    }

    const activity = {
      details: title,
      state: `by ${artist}`,
      startTimestamp: isPlaying ? Date.now() : undefined,
      largeImageKey: albumArt || 'youtube_music',
      largeImageText: 'YouTube Music - Discord RPC',
      smallImageKey: isPlaying ? 'play' : 'pause',
      smallImageText: isPlaying ? 'Oynatılıyor' : 'Duraklatıldı',
      instance: false,
    };

    if (title && artist) {
      activity.buttons = [
        {
          label: '🎵 YouTube Music\'te Dinle',
          url: 'https://music.youtube.com'
        }
      ];
    }

    await rpc.setActivity(activity);
    currentSong = { title, artist, isPlaying };

    if (mainWindow) {
      mainWindow.webContents.send('song-update', currentSong);
    }

    res.json({
      success: true,
      connected: true,
      activity: { title, artist, isPlaying }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      connected: false,
      success: false
    });
  }
});

expressApp.post('/clear', async (req, res) => {
  if (!isConnected || !rpc) {
    return res.json({ success: false, connected: false });
  }

  try {
    await rpc.clearActivity();
    currentSong = null;
    if (mainWindow) {
      mainWindow.webContents.send('song-update', null);
    }
    res.json({ success: true, connected: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function connectDiscord() {
  if (isConnected) return;

  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('discord-status', { connecting: true });
    }

    if (rpc) {
      try { rpc.destroy(); } catch (e) { }
      rpc = null;
    }

    console.log(`🔗 Discord'a bağlanılıyor... (ID: ${CLIENT_ID})`);
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      console.log('✅ Discord\'a bağlandı:', rpc.user.username);
      isConnected = true;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('discord-status', {
          connected: true,
          user: rpc.user.username
        });
      }
      updateTrayMenu();
    });

    rpc.on('disconnected', () => {
      console.log('⚠️ Discord bağlantısı kesildi');
      isConnected = false;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('discord-status', {
          connected: false,
          error: 'Bağlantı kesildi'
        });
      }
      updateTrayMenu();
      setTimeout(connectDiscord, 5000);
    });

    await rpc.login({ clientId: CLIENT_ID });
  } catch (error) {
    console.error('❌ Discord bağlantı hatası:', error.message);
    isConnected = false;

    let detailedError = error.message;
    if (error.message.includes('Could not connect')) {
      detailedError = 'Discord uygulaması bulunamadı or RPC kapalı.';
    } else if (error.message.includes('connection closed')) {
      detailedError = 'Bağlantı Discord tarafından reddedildi. Client ID yanlış olabilir.';
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('discord-status', {
        connected: false,
        error: detailedError
      });
    }
    updateTrayMenu();
    setTimeout(connectDiscord, 10000);
  }
}

async function startServer() {
  try {
    const foundPort = await findAvailablePort(6470);
    PORT = foundPort;
    console.log(`🔍 Kullanılabilir port bulundu: ${PORT}`);

    server = expressApp.listen(PORT, '127.0.0.1', () => {
      console.log(`✅ Sunucu başlatıldı: http://127.0.0.1:${PORT}`);
      console.log(`📡 Bridge hazır - Chrome uzantısı bu porta bağlanabilir`);

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('server-status', {
          running: true,
          port: PORT
        });
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} kullanımda, yeni port aranıyor...`);
        setTimeout(async () => {
          startServer();
        }, 1000);
      } else {
        console.error('❌ Sunucu hatası:', error.message);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('server-status', {
            running: false,
            error: error.message
          });
        }
      }
    });

  } catch (error) {
    console.error('❌ Sunucu başlatma hatası:', error.message);
    setTimeout(startServer, 5000);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'siyah256.ico'),
    autoHideMenuBar: true,
    resizable: false,
    title: 'YouTube Music Discord RPC',
    titleBarStyle: 'default',
    frame: true,
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isConnected ? `✅ Discord: ${rpc.user.username}` : '❌ Discord: Bağlı değil',
      enabled: false
    },
    {
      label: currentSong ? `🎵 ${currentSong.title}` : '🎵 Şarkı çalmıyor',
      enabled: false
    },
    { type: 'separator' },
    {
      label: '📖 Aç',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    {
      label: '🔄 Discord\'a Yeniden Bağlan',
      click: () => {
        connectDiscord();
      }
    },
    { type: 'separator' },
    {
      label: '❌ Çıkış',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'siyah16.ico'));
  tray = new Tray(icon);

  tray.setToolTip('YouTube Music Discord RPC');
  updateTrayMenu();

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  startServer();
  connectDiscord();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', async () => {
  if (rpc && isConnected) {
    await rpc.clearActivity();
    rpc.destroy();
  }
  if (server) {
    server.close();
  }
});

ipcMain.on('get-status', (event) => {
  event.reply('discord-status', {
    connected: isConnected,
    user: isConnected && rpc ? rpc.user.username : null
  });
  event.reply('server-status', {
    running: !!server,
    port: PORT
  });
  event.reply('song-update', currentSong);
  event.reply('current-client-id', CLIENT_ID);
});

ipcMain.on('reconnect-discord', () => {
  connectDiscord();
});

ipcMain.on('update-client-id', (event, newId) => {
  CLIENT_ID = newId;
  console.log('🆔 Client ID güncellendi:', CLIENT_ID);
  isConnected = false;
  if (rpc) {
    try { rpc.destroy(); } catch (e) { }
    rpc = null;
  }
  connectDiscord();
});
