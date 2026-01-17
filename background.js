// Background service worker - Discord bridge ile iletişim kurar

let currentSong = null;
let discordConnected = false;
let lastUpdateTime = 0;
let bridgePort = null; // Dinamik port

// Kullanılabilir bridge portunu bul
async function findBridgePort() {
  const possiblePorts = [6470, 6471, 6472, 6463, 6464, 6465, 6466, 6467, 6468, 6469]; // 6470 ve üstü öncelikli

  for (const port of possiblePorts) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`, {
        signal: AbortSignal.timeout(1000) // 1 saniye timeout (hızlandırdım)
      });

      if (response.ok) {
        console.log(`✅ Bridge bulundu: 127.0.0.1:${port}`);
        bridgePort = port;
        return port;
      }
    } catch (error) {
      // Bu port çalışmıyor, devam et
      continue;
    }
  }

  console.log('❌ Hiçbir portta bridge bulunamadı');
  bridgePort = null;
  return null;
}

// Bridge bağlantısını kontrol et
async function checkBridgeConnection() {
  try {
    // Port bulunamadıysa veya öncekini test et
    if (!bridgePort) {
      await findBridgePort();
    }

    if (!bridgePort) {
      discordConnected = false;
      return false;
    }

    const response = await fetch(`http://127.0.0.1:${bridgePort}/health`, {
      signal: AbortSignal.timeout(1500)
    });

    if (!response.ok) throw new Error('Not OK');

    const data = await response.json();
    discordConnected = data.connected;

    if (data.connected) {
      console.log(`💚 Bridge bağlı (port ${bridgePort}) - Discord kullanıcısı:`, data.user);
    } else {
      console.log(`⚠️ Bridge çalışıyor (port ${bridgePort}) ama Discord bağlı değil`);
    }

    return data.connected;
  } catch (error) {
    discordConnected = false;

    // Port değişmiş olabilir, yeniden ara
    if (bridgePort) {
      console.log(`❌ Port ${bridgePort} artık çalışmıyor, yeniden aranıyor...`);
      bridgePort = null;
      // Hemen arama, bir sonraki döngüde ara veya tek seferlik dene
      const port = await findBridgePort();
      return !!port;
    }

    console.log('❌ Bridge\'e bağlanılamıyor. YouTube Music RPC uygulamasını açın!');
    return false;
  }
}

// Her 5 saniyede bir bağlantıyı kontrol et
setInterval(checkBridgeConnection, 5000);
checkBridgeConnection();

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SONG_UPDATE') {
    currentSong = message.data;
    updateDiscordPresence(message.data);
    sendResponse({ success: true }); // Yanıt gönder
  } else if (message.type === 'GET_CURRENT_SONG') {
    sendResponse({ song: currentSong, connected: discordConnected });
  }
  return true; // Async response için gerekli
});

// Discord Rich Presence'ı güncelle
async function updateDiscordPresence(songData) {
  // Çok sık güncelleme yapma (en az 2 saniye ara)
  const now = Date.now();
  if (now - lastUpdateTime < 2000) {
    return;
  }
  lastUpdateTime = now;

  // Port bulunamadıysa önce bul
  if (!bridgePort) {
    await findBridgePort();
    if (!bridgePort) {
      console.log('❌ Bridge bulunamadı, güncelleme atlanıyor');
      return;
    }
  }

  console.log(`🎵 Bridge\'e şarkı gönderiliyor (port ${bridgePort}):`, songData.title);

  try {
    const response = await fetch(`http://127.0.0.1:${bridgePort}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: songData.title,
        artist: songData.artist,
        isPlaying: songData.isPlaying,
        albumArt: songData.image, // Yüksek çözünürlük albüm kapağı
        currentTime: songData.currentTime,
        duration: songData.duration,
        progress: songData.progress
      }),
      signal: AbortSignal.timeout(5000) // 5 saniye timeout
    });

    if (!response.ok) {
      console.error('❌ Bridge yanıt hatası:', response.status, response.statusText);
      discordConnected = false;

      // Port değişmiş olabilir
      if (response.status === 0 || response.status >= 500) {
        bridgePort = null;
      }
      return;
    }

    const data = await response.json();
    console.log('📨 Bridge yanıtı:', data);

    if (data.success) {
      discordConnected = true;
      console.log('✅ Discord güncellendi:', songData.title);
    } else {
      discordConnected = false;
      console.log('❌ Discord güncellenemedi:', data.error || 'Bilinmeyen hata');
    }
  } catch (error) {
    discordConnected = false;
    console.error('❌ Bridge bağlantı hatası:', error.message);

    // Port değişmiş olabilir, yeniden ara
    bridgePort = null;

    console.log('💡 Çözüm: discord-app klasöründe HIZLI-KURULUM.bat çalıştırın');
  }
}

// Eklenti kapatıldığında presence'ı temizle
chrome.runtime.onSuspend.addListener(async () => {
  if (bridgePort) {
    try {
      await fetch(`http://127.0.0.1:${bridgePort}/clear`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000)
      });
    } catch (error) {
      // Sessizce başarısız ol
    }
  }
});
