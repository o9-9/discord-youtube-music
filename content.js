// YouTube Music'ten şarkı bilgilerini çeken content script

let lastSongData = null;

function getSongInfo() {
  try {
    // Şarkı başlığı
    const titleElement = document.querySelector('.title.style-scope.ytmusic-player-bar');
    const title = titleElement ? titleElement.textContent.trim() : null;

    // Sanatçı adı
    const artistElement = document.querySelector('.byline.style-scope.ytmusic-player-bar');
    const artist = artistElement ? artistElement.textContent.trim() : null;

    // Albüm resmi (yüksek çözünürlük)
    const imageElement = document.querySelector('img.style-scope.ytmusic-player-bar');
    let image = imageElement ? imageElement.src : null;
    
    // Yüksek çözünürlük için resmi düzenle
    if (image) {
      // YouTube Music resimleri genelde =w60-h60 gibi parametreler içerir
      // Bunları =w512-h512 yaparak yüksek çözünürlük elde ederiz
      image = image.replace(/=w\d+-h\d+/, '=w512-h512');
    }

    // Oynatma durumu
    const playButton = document.querySelector('#play-pause-button');
    const isPlaying = playButton ? playButton.getAttribute('aria-label')?.includes('Duraklat') : false;

    // Süre bilgileri
    const currentTimeElement = document.querySelector('.time-info.style-scope.ytmusic-player-bar span:first-child');
    const durationElement = document.querySelector('.time-info.style-scope.ytmusic-player-bar span:last-child');
    
    const currentTime = currentTimeElement ? currentTimeElement.textContent.trim() : '0:00';
    const duration = durationElement ? durationElement.textContent.trim() : '0:00';

    // Progress bar (Spotify tarzı için)
    const progressBar = document.querySelector('#progress-bar');
    const progress = progressBar ? progressBar.value : 0;

    return {
      title,
      artist,
      image,
      isPlaying,
      currentTime,
      duration,
      progress,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Şarkı bilgisi alınamadı:', error);
    return null;
  }
}

function sendSongData() {
  const songData = getSongInfo();
  
  if (songData && songData.title && songData.artist) {
    // Sadece değişiklik varsa gönder
    const dataChanged = !lastSongData || 
      lastSongData.title !== songData.title ||
      lastSongData.artist !== songData.artist ||
      lastSongData.isPlaying !== songData.isPlaying;

    if (dataChanged) {
      try {
        chrome.runtime.sendMessage({
          type: 'SONG_UPDATE',
          data: songData
        }, (response) => {
          // Hata kontrolü
          if (chrome.runtime.lastError) {
            console.log('⚠️ Eklenti yeniden yüklendi. Sayfayı yenileyin.');
            return;
          }
        });
        lastSongData = songData;
      } catch (error) {
        // Extension context invalidated - sessizce devam et
        console.log('⚠️ Eklenti bağlantısı kesildi. Sayfayı yenileyin.');
      }
    }
  }
}

// Her 2 saniyede bir kontrol et
let updateInterval = setInterval(sendSongData, 2000);

// Sayfa yüklendiğinde hemen kontrol et
setTimeout(sendSongData, 1000);

// Sayfa kapatılırken temizle
window.addEventListener('beforeunload', () => {
  clearInterval(updateInterval);
});

console.log('🎵 YouTube Music Discord Rich Presence aktif!');
