// Main Application Controller & Forest Map Router (iPad & English Optimized)
(function() {
  const STORAGE_KEY = 'elsa_english_stars_v3';
  let stars = parseInt(localStorage.getItem(STORAGE_KEY) || '10', 10);

  window.getStars = function() {
    return stars;
  };

  window.addStar = function(count = 1) {
    stars += count;
    localStorage.setItem(STORAGE_KEY, stars.toString());
    const badge = document.getElementById('global-stars-badge');
    if (badge) badge.innerText = `⭐ ${stars}`;
  };

  window.createSparkles = function(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      const angle = (i / 20) * 2 * Math.PI;
      const dist = 55 + Math.random() * 70;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      sparkle.style.left = `${centerX}px`;
      sparkle.style.top = `${centerY}px`;
      sparkle.style.setProperty('--tx', `${tx}px`);
      sparkle.style.setProperty('--ty', `${ty}px`);
      sparkle.innerHTML = ['✨', '⭐', '❄️', '💎', '🌸'][Math.floor(Math.random() * 5)];

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 900);
    }
  };

  function initSnowfall() {
    const container = document.getElementById('snowflakes-container');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      const flake = document.createElement('div');
      flake.className = 'falling-snowflake';
      flake.innerText = ['❄', '❅', '❆', '•'][Math.floor(Math.random() * 4)];
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDuration = `${6 + Math.random() * 8}s`;
      flake.style.animationDelay = `${Math.random() * 5}s`;
      flake.style.fontSize = `${14 + Math.random() * 18}px`;
      flake.style.opacity = `${0.35 + Math.random() * 0.55}`;
      container.appendChild(flake);
    }
  }

  window.showScreen = function(screenName) {
    if (window.homeAutoSpeakTimer && screenName !== 'home') {
      clearTimeout(window.homeAutoSpeakTimer);
      window.homeAutoSpeakTimer = null;
    }

    const appContainer = document.getElementById('app-main');
    if (!appContainer) return;

    appContainer.innerHTML = '';
    window.scrollTo(0, 0);

    switch(screenName) {
      case 'home':
        renderHomeScreen(appContainer);
        break;
      case 'map':
        renderMapScreen(appContainer);
        break;
      case 'garden':
        if (window.initGardenColors) window.initGardenColors(appContainer);
        break;
      case 'pond':
        if (window.initCountingPond) window.initCountingPond(appContainer);
        break;
      case 'farm':
        if (window.initFarmAnimals) window.initFarmAnimals(appContainer);
        break;
      case 'music':
        if (window.initMusicHouse) window.initMusicHouse(appContainer);
        break;
      case 'habits':
        if (window.initGoodHabits) window.initGoodHabits(appContainer);
        break;
      case 'letters':
      case 'tracing':
        if (window.initIceWandGame) window.initIceWandGame(appContainer);
        break;
      case 'flashcards':
        if (window.initFlashcardsGame) window.initFlashcardsGame(appContainer);
        break;
      case 'feed':
        if (window.initFeedOlafGame) window.initFeedOlafGame(appContainer);
        break;
      case 'stickers':
        if (window.initStickerAlbum) window.initStickerAlbum(appContainer);
        break;
      case 'coloring':
        if (window.initColoringZone) window.initColoringZone(appContainer);
        break;
      case 'gallery':
      case 'puzzle':
        if (window.initGalleryZone) window.initGalleryZone(appContainer);
        break;
      default:
        renderHomeScreen(appContainer);
    }
  };

  // HOME SCREEN (iPad Friendly, Pure English, Direct Start)
  function renderHomeScreen(container) {
    const isMusicOn = window.soundEngine && window.soundEngine.isBgmPlaying();
    const heroNgocMyImg = window.getRandomNgocMyImg ? window.getRandomNgocMyImg() : 'Image/Ngocmy.jpg';

    container.innerHTML = `
      <div class="home-hero-wrap">
        <div class="hero-top-bar">
          <div class="app-brand-pill">
            <span class="brand-snowflake">❄️</span>
            <span class="brand-title">Elsa English</span>
          </div>

          <div class="hero-top-actions" style="display: flex; align-items: center; gap: 8px;">
            <button class="bgm-music-toggle-btn ${isMusicOn ? 'bgm-active' : ''}" id="btn-toggle-bgm" title="Toggle Background Music">
              ${isMusicOn ? '🎵 <span class="bgm-label">Music</span>' : '🔇 <span class="bgm-label">Muted</span>'}
            </button>
            <div class="star-badge" id="global-stars-badge">⭐ ${stars}</div>
          </div>
        </div>

        <!-- HERO DUO: ELSA CĂN TRÁI VÀ ELSA NGỌC MỸ CĂN PHẢI -->
        <div class="hero-poster-box hero-royal-duo">
          <!-- Trái: Elsa & Olaf -->
          <div class="hero-left-characters" id="hero-left-group">
            <img src="Image/elsa_3d.png" alt="Elsa Queen" class="real-elsa-hero" id="hero-elsa" />
            <img src="Image/olaf_3d.png" alt="Olaf" class="real-olaf-hero" id="hero-olaf" />
          </div>

          <!-- Phải: Elsa Ngọc Mỹ (Cao bằng Elsa) - Random ảnh công chúa Ngọc Mỹ -->
          <div class="hero-right-ngocmy" id="hero-ngocmy-box">
            <div class="ngocmy-photo-frame" id="frame-ngocmy" title="Tap to see next picture!">
              <img src="${heroNgocMyImg}" alt="Princess Elsa Ngọc Mỹ" class="ngocmy-photo-img" id="img-hero-ngocmy" />
              <div class="ngocmy-crown-badge">👑</div>
              <div class="ngocmy-name-tag">Elsa Ngọc Mỹ 🌸</div>
            </div>
          </div>
        </div>

        <div class="start-adventure-box">
          <button class="big-explore-btn" id="btn-start-adventure">
            <span class="explore-icon">🗺️</span>
            <span class="explore-text">START ADVENTURE</span>
            <span class="explore-sparkle">✨</span>
          </button>
        </div>

        <!-- 4 QUICK ACCESS BUTTONS WITH CHARACTER THUMBNAILS -->
        <div class="quick-nav-row home-four-buttons">
          <button class="quick-pill-btn btn-pill-feed" id="btn-go-feed">
            <img src="Image/elsa_3d.png" class="home-btn-avatar" alt="Elsa" />
            <span>Feed Elsa</span>
          </button>
          <button class="quick-pill-btn btn-pill-coloring" id="btn-go-coloring">
            <img src="coloring/elsa_coloring_1.jpg" class="home-btn-avatar" alt="Coloring" />
            <span>Coloring</span>
          </button>
          <button class="quick-pill-btn btn-pill-gallery" id="btn-go-gallery">
            <img src="${heroNgocMyImg}" class="home-btn-avatar" alt="Puzzle" />
            <span>Puzzle</span>
          </button>
          <button class="quick-pill-btn btn-pill-habits" id="btn-go-habits">
            <img src="Image/elsa_anna_royal.jpg" class="home-btn-avatar" alt="Habits" />
            <span>Habits</span>
          </button>
        </div>

        <!-- KHUNG HÌNH KỲ DIỆU PHỦ 1/3 MÀN HÌNH DƯỚI (FROZEN 3 MAGIC KINGDOM) -->
        <div class="home-bottom-scenic-card" id="home-scenic-card" title="Tap to enter kingdom!">
          <img src="Image/gallery_04_frozen3_magic.webp" class="home-bottom-scenic-img" alt="Enchanted Frozen World" />
          <div class="home-bottom-scenic-overlay">
            <span class="scenic-sparkle-pill">❄️ Explore Magic Forest & Kingdom ✨</span>
          </div>
        </div>
      </div>
    `;

    // Music toggle
    const bgmBtn = container.querySelector('#btn-toggle-bgm');
    if (bgmBtn) {
      bgmBtn.onclick = () => {
        const playing = window.soundEngine.toggleBackgroundMusic();
        window.soundEngine.updateBgmUi(playing);
      };
    }

    container.querySelector('#btn-start-adventure').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelector('#btn-go-feed').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('feed');
    };

    container.querySelector('#btn-go-coloring').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('coloring');
    };

    container.querySelector('#btn-go-gallery').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('gallery');
    };

    const habitsQuickBtn = container.querySelector('#btn-go-habits');
    if (habitsQuickBtn) {
      habitsQuickBtn.onclick = () => {
        window.soundEngine.playPop();
        window.showScreen('habits');
      };
    }

    container.querySelector('#hero-elsa').onclick = () => {
      window.soundEngine.playMagic();
      window.createSparkles(container.querySelector('#hero-elsa'));
      window.speechEngine.speak("Hello darling!");
    };

    container.querySelector('#hero-olaf').onclick = () => {
      window.soundEngine.playPop();
      window.createSparkles(container.querySelector('#hero-olaf'));
      window.speechEngine.speak("I like warm hugs!");
    };

    const frameNgocMy = container.querySelector('#frame-ngocmy');
    if (frameNgocMy) {
      frameNgocMy.onclick = () => {
        window.soundEngine.playSuccess();
        window.createSparkles(frameNgocMy);
        const imgEl = frameNgocMy.querySelector('#img-hero-ngocmy');
        if (imgEl && window.getRandomNgocMyImg) {
          imgEl.src = window.getRandomNgocMyImg();
        }
        window.speechEngine.speak("Elsa Ngọc Mỹ! So sweet and beautiful! 💖");
      };
    }

    const homeScenicCard = container.querySelector('#home-scenic-card');
    if (homeScenicCard) {
      homeScenicCard.onclick = () => {
        window.soundEngine.playMagic();
        window.createSparkles(homeScenicCard);
        window.showScreen('map');
      };
    }
  }

  // FOREST MAP SCREEN (Pure English, Elsa Themed)
  function renderMapScreen(container) {
    const isMusicOn = window.soundEngine && window.soundEngine.isBgmPlaying();

    container.innerHTML = `
      <div class="forest-map-screen">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-home">🏰 Home</button>
          <h2 class="zone-title">🗺️ Elsa's Magic Forest</h2>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="bgm-music-toggle-btn ${isMusicOn ? 'bgm-active' : ''}" id="btn-toggle-bgm" title="Toggle Music">
              ${isMusicOn ? '🎵 <span class="bgm-label">Music</span>' : '🔇 <span class="bgm-label">Muted</span>'}
            </button>
            <div class="star-badge" id="map-stars">⭐ ${stars}</div>
          </div>
        </div>

        <div class="map-guide-banner">
          <img src="Image/elsa_3d.png" class="map-elsa-mini" alt="Queen Elsa" />
          <div class="map-guide-text">
            "Welcome to my magical enchanted forest! Pick any game to play and learn!" ❄️✨
          </div>
        </div>

        <div class="map-zones-grid">
          <button class="map-zone-card zone-garden" data-zone="garden">
            <div class="zone-badge">Zone 1</div>
            <img src="Image/gallery_06_elsa_smile.jpg" class="zone-character-thumb" alt="Elsa Colors" />
            <div class="zone-name">Elsa's Colors Garden</div>
            <div class="zone-sub">Colors with Queen Elsa</div>
          </button>

          <button class="map-zone-card zone-pond" data-zone="pond">
            <div class="zone-badge">Zone 2</div>
            <img src="Image/olaf_3d.png" class="zone-character-thumb" alt="Elsa & Olaf Pond" />
            <div class="zone-name">Elsa's Ice Pond</div>
            <div class="zone-sub">Count 1 to 10 with Elsa & Olaf</div>
          </button>

          <button class="map-zone-card zone-farm" data-zone="farm">
            <div class="zone-badge">Zone 3</div>
            <img src="Image/sven_3d.png" class="zone-character-thumb" alt="Sven & Friends" />
            <div class="zone-name">Elsa's Winter Friends</div>
            <div class="zone-sub">Sven, Olaf & Animals</div>
          </button>

          <button class="map-zone-card zone-letters" data-zone="letters">
            <div class="zone-badge">Zone 4</div>
            <img src="Image/elsa_3d.png" class="zone-character-thumb" alt="Elsa Alphabet" />
            <div class="zone-name">Elsa's Alphabet Hill</div>
            <div class="zone-sub">Uppercase Letters A-Z</div>
          </button>

          <button class="map-zone-card zone-music" data-zone="music">
            <div class="zone-badge">Zone 5</div>
            <img src="Image/gallery_08_elsa_magic.jpg" class="zone-character-thumb" alt="Elsa Cinema" />
            <div class="zone-name">🎬 Elsa's Magic Cinema</div>
            <div class="zone-sub">Short Videos of Elsa</div>
          </button>

          <button class="map-zone-card zone-puzzle" data-zone="gallery">
            <div class="zone-badge">Zone 6</div>
            <img src="${window.getRandomNgocMyImg ? window.getRandomNgocMyImg() : 'Image/Ngocmy.jpg'}" class="zone-character-thumb" alt="Elsa Photo Puzzle" />
            <div class="zone-name">🧩 Elsa's Photo Puzzle</div>
            <div class="zone-sub">Royal Jigsaw 4 & 6 Frames</div>
          </button>
        </div>

        <div class="map-footer-row">
          <button class="extra-btn" id="btn-open-feed">
            <img src="Image/elsa_3d.png" class="footer-btn-thumb" alt="Feed Elsa" />
            <span>Feed Elsa</span>
          </button>
          <button class="extra-btn" id="btn-open-coloring">
            <img src="coloring/elsa_coloring_1.jpg" class="footer-btn-thumb" alt="Elsa Coloring" />
            <span>Coloring</span>
          </button>
          <button class="extra-btn" id="btn-open-habits">
            <img src="Image/elsa_anna_royal.jpg" class="footer-btn-thumb" alt="Daily Habits" />
            <span>Royal Habits</span>
          </button>
          <button class="extra-btn" id="btn-open-stickers">
            <img src="Image/olaf_3d.png" class="footer-btn-thumb" alt="Royal Stickers" />
            <span>Stickers</span>
          </button>
        </div>
      </div>
    `;

    // Music toggle
    const bgmBtn = container.querySelector('#btn-toggle-bgm');
    if (bgmBtn) {
      bgmBtn.onclick = () => {
        const playing = window.soundEngine.toggleBackgroundMusic();
        window.soundEngine.updateBgmUi(playing);
      };
    }

    container.querySelector('#btn-back-home').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('home');
    };

    container.querySelector('#btn-open-coloring').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('coloring');
    };

    container.querySelector('#btn-open-habits').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('habits');
    };

    container.querySelector('#btn-open-feed').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('feed');
    };

    container.querySelector('#btn-open-stickers').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('stickers');
    };

    container.querySelectorAll('.map-zone-card').forEach(btn => {
      btn.onclick = () => {
        window.soundEngine.playPop();
        const zone = btn.dataset.zone;
        window.showScreen(zone);
      };
    });
  }

  function bootApp() {
    // Silence any lingering speech from previous sessions/cached timers
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (window.homeAutoSpeakTimer) {
      clearTimeout(window.homeAutoSpeakTimer);
      window.homeAutoSpeakTimer = null;
    }

    // Force purge old browser caches
    if (window.caches) {
      caches.keys().then(keys => {
        keys.forEach(k => {
          if (k !== 'elsa-ipad-v26') caches.delete(k);
        });
      });
    }

    initSnowfall();
    window.showScreen('home');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js?v=26')
        .then(reg => {
          reg.update();
          console.log('Elsa PWA Ready v26!');
        })
        .catch(err => console.log('SW error:', err));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
  } else {
    bootApp();
  }
})();
