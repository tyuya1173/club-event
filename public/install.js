let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // デフォルトのプロンプトを防ぐ
  event.preventDefault();
  deferredPrompt = event;

  // ボタンを表示（カスタムUI）
  document.getElementById('install-btn').style.display = 'block';
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
      } else {
        console.log('User dismissed the PWA installation');
      }
      deferredPrompt = null;
    });
  }
}