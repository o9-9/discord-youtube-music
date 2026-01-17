// Popup için JavaScript

function updatePopup() {
  try {
    chrome.runtime.sendMessage({ type: 'GET_CURRENT_SONG' }, (response) => {
      // Hata kontrolü
      if (chrome.runtime.lastError) {
        console.error('Mesaj gönderme hatası:', chrome.runtime.lastError);
        return;
      }

      const statusDiv = document.getElementById('status');
      const songContainer = document.getElementById('songContainer');
      
      if (response && response.connected) {
        statusDiv.className = 'status connected';
        statusDiv.innerHTML = '<span class="status-dot"></span><span>Discord\'a Bağlı</span>';
      } else {
        statusDiv.className = 'status disconnected';
        statusDiv.innerHTML = '<span class="status-dot"></span><span>Discord Bağlantısı Yok</span>';
      }
      
      if (response && response.song && response.song.title) {
        const song = response.song;
        songContainer.innerHTML = `
          <div class="song-info">
            <div class="song-title">${escapeHtml(song.title)}</div>
            <div class="song-artist">${escapeHtml(song.artist)}</div>
          </div>
        `;
      } else {
        songContainer.innerHTML = '<div class="no-song">YouTube Music\'te bir şarkı çalın</div>';
      }
    });
  } catch (error) {
    console.error('Popup güncelleme hatası:', error);
  }
}

// XSS koruması için HTML escape
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sayfa yüklendiğinde ve her 2 saniyede bir güncelle
updatePopup();
setInterval(updatePopup, 2000);
