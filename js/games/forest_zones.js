// 6 Forest Learning Zones (Enhanced per user requests)

// 6 Forest Learning Zones (Enhanced per user requests)

const ELSA_BG_POOL = [
  'Image/elsa_3d.png',
  'Image/anna_3d.png',
  'Image/olaf_3d.png',
  'Image/sven_3d.png',
  'Image/kristoff_3d.png',
  'Image/Ngocmy.jpg',
  'Image/NgocMy (1).jpg',
  'Image/NgocMy (1).png',
  'Image/NgocMy (2).jpg',
  'Image/NgocMy (2).png',
  'Image/NgocMy (3).jpg',
  'Image/NgocMy (3).png',
  'Image/NgocMy (4).jpg',
  'Image/NgocMy (4).png',
  'Image/NgocMy (5).png',
  'Image/NgocMy (6).png',
  'Image/elsa_anna_royal.jpg',
  'Image/elsa_portrait.jpg',
  'Image/frozen_poster.jpg',
  'Image/gallery_01_elsa_snow.webp',
  'Image/gallery_02_frozen2_journey.jpg',
  'Image/gallery_03_elsa_spirit.jpeg',
  'Image/gallery_04_frozen3_magic.webp',
  'Image/gallery_05_elsa_dress.jpg',
  'Image/gallery_06_elsa_smile.jpg',
  'Image/gallery_07_elsa_castle.jpg',
  'Image/gallery_08_elsa_magic.jpg',
  'Image/gallery_09_elsa_power.jpg',
  'Image/gallery_10_elsa_portrait2.jpg'
];

function getRandomElsaBgs(count) {
  const shuffled = [...ELSA_BG_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ==========================================
// 1. COLORS GARDEN: ẢNH NỀN ELSA & BẠN + ĐỔ MÀU MỜ (NHẤN ĐÚNG THÌ MẤT MÀU HIỆN ẢNH)
// ==========================================
window.initGardenColors = function(container) {
  const colorsList = [
    { id: 'red', name: 'Red', hex: '#EF476F', icon: '🍎' },
    { id: 'blue', name: 'Blue', hex: '#0096C7', icon: '❄️' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD166', icon: '⭐' },
    { id: 'green', name: 'Green', hex: '#06D6A0', icon: '🍏' },
    { id: 'purple', name: 'Purple', hex: '#9D4EDD', icon: '🍇' },
    { id: 'orange', name: 'Orange', hex: '#F77F00', icon: '🥕' },
    { id: 'pink', name: 'Pink', hex: '#FF70A6', icon: '🌸' },
    { id: 'white', name: 'White', hex: '#E0F2FE', icon: '🤍' }
  ];

  const TOTAL_ROUNDS = 10;
  let currentRound = 1;
  let targetColor = colorsList[0];
  let options = [];
  let isAnswering = false;

  function pickQuestion() {
    isAnswering = false;
    targetColor = colorsList[Math.floor(Math.random() * colorsList.length)];
    const others = colorsList.filter(c => c.id !== targetColor.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const rawOptions = [targetColor, ...shuffledOthers].sort(() => 0.5 - Math.random());
    
    // Gán ảnh nền Elsa & các bạn độc nhất cho từng ô màu
    const bgs = getRandomElsaBgs(rawOptions.length);
    options = rawOptions.map((opt, i) => ({
      ...opt,
      bg: bgs[i] || 'Image/elsa_3d.png'
    }));

    render();
    setTimeout(() => window.speechEngine.speak(`${targetColor.name}!`), 200);
  }

  function renderVictory() {
    container.innerHTML = `
      <div class="zone-screen victory-screen">
        <div class="victory-card">
          <div class="victory-icon">🎉👑</div>
          <h2 class="victory-title">Level 10 / 10 Complete!</h2>
          <p class="victory-sub">You mastered all 10 color rounds!</p>
          <div class="victory-stars">⭐⭐⭐⭐⭐ +10 Stars</div>
          <div class="victory-actions">
            <button class="action-btn-replay" id="btn-replay">🔄 Play Again</button>
            <button class="action-btn-map" id="btn-victory-map">🗺️ Map</button>
          </div>
        </div>
      </div>
    `;

    window.soundEngine.playSuccess();
    window.addStar(10);
    window.speechEngine.speak("Superstar! Ten out of ten!");

    container.querySelector('#btn-replay').onclick = () => {
      window.soundEngine.playPop();
      currentRound = 1;
      pickQuestion();
    };

    container.querySelector('#btn-victory-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };
  }

  function render() {
    container.innerHTML = `
      <div class="zone-screen">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🌸 Elsa's Colors Garden</h2>
          <div class="star-badge">⭐ ${window.getStars()}</div>
        </div>

        <div class="round-progress-bar">
          <span class="round-label">Level: <strong>${currentRound} / ${TOTAL_ROUNDS}</strong></span>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(currentRound / TOTAL_ROUNDS) * 100}%"></div>
          </div>
        </div>

        <div class="zone-instruction">
          <img src="Image/elsa_3d.png" class="guide-avatar" alt="Elsa" />
          <div class="speech-bubble">
            <p style="font-size: 13px; color: #475569; margin: 0 0 2px;">Find this color for Elsa:</p>
            <p><strong style="font-size: 24px; color: ${targetColor.hex};">${targetColor.name}!</strong></p>
            <button class="sound-repeat-btn" id="btn-repeat">🔊 Listen</button>
          </div>
        </div>

        <div class="fail-alert-banner" id="fail-banner" style="display: none;">
          ❌ Try again!
        </div>

        <!-- KHUNG 4 MÀU VỚI ẢNH NỀN ELSA & LỚP ĐỔ MÀU MỜ -->
        <div class="colors-grid-4">
          ${options.map(item => `
            <button class="color-reveal-card" data-id="${item.id}" id="color-card-${item.id}">
              <div class="color-reveal-bg-wrap">
                <img src="${item.bg}" class="color-reveal-bg-img" alt="Elsa & Friends" />
              </div>
              <div class="color-tint-overlay" style="background-color: ${item.hex}de;">
                <span class="color-reveal-emoji">${item.icon}</span>
                <span class="color-reveal-name">${item.name}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelector('#btn-repeat').onclick = () => {
      window.soundEngine.playPop();
      window.speechEngine.speak(`${targetColor.name}!`);
    };

    container.querySelectorAll('.color-reveal-card').forEach(btn => {
      btn.onclick = () => {
        if (isAnswering) return;
        const selectedId = btn.dataset.id;

        if (selectedId === targetColor.id) {
          isAnswering = true;
          // MẤT LỚP MÀU, HIỂN THỊ ẢNH ELSA & BẠN NGUYÊN VẸN
          const overlay = btn.querySelector('.color-tint-overlay');
          if (overlay) {
            overlay.classList.add('tint-dissolved');
          }
          btn.classList.add('card-revealed-success', 'bounce-pop');
          window.soundEngine.playSuccess();
          window.createSparkles(btn);
          window.addStar(1);
          window.speechEngine.praise();

          setTimeout(() => {
            if (currentRound < TOTAL_ROUNDS) {
              currentRound++;
              pickQuestion();
            } else {
              renderVictory();
            }
          }, 1500);
        } else {
          window.soundEngine.playBuzzer();
          btn.classList.add('fail-pick');
          const failBanner = container.querySelector('#fail-banner');
          if (failBanner) {
            failBanner.style.display = 'block';
            setTimeout(() => { failBanner.style.display = 'none'; }, 1200);
          }
          window.speechEngine.speak("Try again!");
          setTimeout(() => btn.classList.remove('fail-pick'), 600);
        }
      };
    });
  }

  pickQuestion();
};

// ==========================================
// 2. COUNTING POND: ẢNH NỀN ELSA & BẠN + CHÈN CON VẬT + Ô NHỎ CHỌN SỐ LƯỢNG
// ==========================================
window.initCountingPond = function(container) {
  const numNames = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  const creatureEmojis = ['🐠', '🐬', '🐟', '🐡', '🦆', '🐰', '🐧', '🦀', '🐙'];

  // Danh sách các ảnh nền cảnh Frozen & Elsa tuyệt đẹp nhìn bao quát không bị mất đầu
  const COUNTING_SCENE_BGS = [
    'Image/gallery_04_frozen3_magic.webp',
    'Image/gallery_07_elsa_castle.jpg',
    'Image/gallery_02_frozen2_journey.jpg',
    'Image/gallery_01_elsa_snow.webp',
    'Image/gallery_08_elsa_magic.jpg',
    'Image/gallery_03_elsa_spirit.jpeg',
    'Image/elsa_portrait.jpg',
    'Image/frozen_poster.jpg',
    'Image/elsa_anna_royal.jpg',
    'Image/Ngocmy.jpg',
    'Image/NgocMy (1).jpg',
    'Image/NgocMy (2).jpg',
    'Image/NgocMy (3).jpg',
    'Image/NgocMy (4).jpg'
  ];

  // Tọa độ phân bố 10 vị trí hài hòa trên ảnh nền không bị trùng lặp hay lọt ra mép
  const PRESET_POSITIONS = [
    { x: 16, y: 22 },
    { x: 48, y: 18 },
    { x: 76, y: 24 },
    { x: 28, y: 46 },
    { x: 56, y: 42 },
    { x: 80, y: 50 },
    { x: 18, y: 68 },
    { x: 42, y: 72 },
    { x: 68, y: 70 },
    { x: 84, y: 72 }
  ];

  let deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => 0.5 - Math.random());
  let currentTargetNum = deck[0];
  let currentSceneBg = 'Image/gallery_04_frozen3_magic.webp';
  let currentCreature = '🐠';
  let options = [];
  let isAnswering = false;

  function pickQuestion() {
    isAnswering = false;
    if (deck.length === 0) {
      deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => 0.5 - Math.random());
    }
    currentTargetNum = deck.pop();

    // Chọn ảnh nền cảnh Elsa & Frozen rộng đẹp
    currentSceneBg = COUNTING_SCENE_BGS[Math.floor(Math.random() * COUNTING_SCENE_BGS.length)];
    currentCreature = creatureEmojis[Math.floor(Math.random() * creatureEmojis.length)];

    const allNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const others = allNums.filter(n => n !== currentTargetNum);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    options = [currentTargetNum, ...shuffledOthers].sort(() => 0.5 - Math.random());

    render();

    const word = numNames[currentTargetNum] || currentTargetNum.toString();
    setTimeout(() => {
      window.speechEngine.speak(`${word}!`);
    }, 200);
  }

  function render() {
    const word = numNames[currentTargetNum] || currentTargetNum.toString();
    const positions = PRESET_POSITIONS.slice(0, currentTargetNum);

    container.innerHTML = `
      <div class="zone-screen pond-screen-wrap">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🐟 Elsa's Ice Pond</h2>
          <div class="star-badge">⭐ ${window.getStars()}</div>
        </div>

        <div class="zone-instruction">
          <div style="display: flex; align-items: flex-end; gap: 4px;">
            <img src="Image/elsa_3d.png" class="guide-avatar" alt="Queen Elsa" />
            <img src="Image/olaf_3d.png" alt="Olaf" style="width: 42px; height: 56px; object-fit: contain; margin-bottom: 4px;" />
          </div>
          <div class="speech-bubble">
            <p style="font-size: 13px; color: #475569; margin: 0 0 2px;">Help Elsa count:</p>
            <p><strong style="font-size: 20px; color: #0284c7;">Count the ${currentCreature}! 🎧</strong></p>
            <button class="sound-repeat-btn" id="btn-repeat">🔊 Listen: "${word}!"</button>
          </div>
        </div>

        <div class="fail-alert-banner" id="fail-banner" style="display: none;">
          ❌ Count again!
        </div>

        <!-- ẢNH NỀN ELSA & BẠN VỚI CÁC CON VẬT CHÈN LÊN PHÍA TRÊN -->
        <div class="count-scene-card" style="background-image: url('${currentSceneBg}');" id="count-stage">
          <div class="count-scene-glass-tint"></div>
          ${positions.map((pos, idx) => `
            <div class="count-creature-sprite" 
                 style="left: ${pos.x}%; top: ${pos.y}%; animation-delay: ${idx * 0.2}s;">
              ${currentCreature}
            </div>
          `).join('')}
        </div>

        <!-- CÁC Ô NHỎ BÊN DƯỚI ĐỂ BÉ CHỌN SỐ LƯỢNG -->
        <div class="count-selection-guide">
          <span>👇 Tap the correct number box below:</span>
        </div>

        <div class="count-choices-row">
          ${options.map(num => `
            <button class="count-number-box" data-num="${num}" id="num-btn-${num}">
              <span class="count-number-digit">${num}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelector('#btn-repeat').onclick = () => {
      window.soundEngine.playPop();
      window.speechEngine.speak(`${word}!`);
    };

    container.querySelectorAll('.count-number-box').forEach(btn => {
      btn.onclick = () => {
        if (isAnswering) return;
        const selectedNum = parseInt(btn.dataset.num, 10);

        if (selectedNum === currentTargetNum) {
          isAnswering = true;
          btn.classList.add('count-box-correct', 'bounce-pop');

          // Hiệu ứng các con vật nhảy múa chúc mừng
          container.querySelectorAll('.count-creature-sprite').forEach(sprite => {
            sprite.classList.add('creature-jump-dance');
          });

          window.soundEngine.playWaterSplash();
          window.soundEngine.playSuccess();
          window.createSparkles(btn);
          window.createSparkles(container.querySelector('#count-stage'));
          window.addStar(2);

          window.speechEngine.speak(`${word}! Yes!`);
          setTimeout(pickQuestion, 1600);
        } else {
          window.soundEngine.playBuzzer();
          btn.classList.add('count-box-wrong');
          const failBanner = container.querySelector('#fail-banner');
          if (failBanner) {
            failBanner.style.display = 'block';
            setTimeout(() => { failBanner.style.display = 'none'; }, 1200);
          }
          window.speechEngine.speak("Try again!");
          setTimeout(() => btn.classList.remove('count-box-wrong'), 600);
        }
      };
    });
  }

  pickQuestion();
};

// ==========================================
// 3. ANIMAL FARM: ẢNH NỀN ELSA & BẠN + CHÈN CON VẬT LÊN (NHẤN ĐÚNG THÌ MẤT CON VẬT HIỆN ẢNH)
// ==========================================
window.initFarmAnimals = function(container) {
  const animalsList = [
    { id: 'dog', name: 'Dog', icon: '🐶' },
    { id: 'cat', name: 'Cat', icon: '🐱' },
    { id: 'duck', name: 'Duck', icon: '🦆' },
    { id: 'cow', name: 'Cow', icon: '🐮' },
    { id: 'sheep', name: 'Sheep', icon: '🐑' },
    { id: 'horse', name: 'Horse', icon: '🐴' },
    { id: 'rabbit', name: 'Rabbit', icon: '🐰' },
    { id: 'bear', name: 'Bear', icon: '🐻' },
    { id: 'lion', name: 'Lion', icon: '🦁' },
    { id: 'tiger', name: 'Tiger', icon: '🐯' },
    { id: 'elephant', name: 'Elephant', icon: '🐘' },
    { id: 'monkey', name: 'Monkey', icon: '🐵' },
    { id: 'panda', name: 'Panda', icon: '🐼' },
    { id: 'penguin', name: 'Penguin', icon: '🐧' },
    { id: 'dolphin', name: 'Dolphin', icon: '🐬' },
    { id: 'butterfly', name: 'Butterfly', icon: '🦋' }
  ];

  let currentTarget = animalsList[0];
  let options = [];
  let isAnswering = false;

  function pickQuestion() {
    isAnswering = false;
    currentTarget = animalsList[Math.floor(Math.random() * animalsList.length)];
    const others = animalsList.filter(a => a.id !== currentTarget.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const rawOptions = [currentTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    
    // Gán ảnh nền Elsa & các bạn độc nhất cho từng ô
    const bgs = getRandomElsaBgs(rawOptions.length);
    options = rawOptions.map((opt, i) => ({
      ...opt,
      bg: bgs[i] || 'Image/elsa_3d.png'
    }));

    render();

    setTimeout(() => {
      window.speechEngine.speak(`${currentTarget.name}!`);
    }, 200);
  }

  function render() {
    container.innerHTML = `
      <div class="zone-screen farm-screen-wrap">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🐾 Elsa's Winter Friends</h2>
          <div class="star-badge">⭐ ${window.getStars()}</div>
        </div>

        <div class="zone-instruction">
          <img src="Image/elsa_3d.png" class="guide-avatar" alt="Queen Elsa" />
          <div class="speech-bubble">
            <p style="font-size: 13px; color: #475569; margin: 0 0 2px;">Elsa's Animal Friends:</p>
            <p><strong class="animal-target-sound" style="font-size: 24px; color: #0077b6;">${currentTarget.name}!</strong></p>
            <button class="sound-repeat-btn" id="btn-repeat">🔊 Listen</button>
          </div>
        </div>

        <div class="fail-alert-banner" id="fail-banner" style="display: none;">
          ❌ Try again!
        </div>

        <!-- KHUNG 4 Ô CÓ ẢNH NỀN ELSA & BẠN + CON VẬT CHÈN LÊN PHÍA TRÊN -->
        <div class="animals-grid-2x2">
          ${options.map(item => `
            <button class="animal-reveal-card" data-id="${item.id}" id="animal-card-${item.id}">
              <div class="animal-reveal-bg-wrap">
                <img src="${item.bg}" class="animal-reveal-bg-img" alt="Elsa & Friends" />
              </div>
              <div class="animal-sticker-layer">
                <span class="animal-sticker-emoji">${item.icon}</span>
                <span class="animal-sticker-name">${item.name}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelector('#btn-repeat').onclick = () => {
      window.soundEngine.playPop();
      window.speechEngine.speak(`${currentTarget.name}!`);
    };

    container.querySelectorAll('.animal-reveal-card').forEach(btn => {
      btn.onclick = () => {
        if (isAnswering) return;
        const id = btn.dataset.id;

        if (id === currentTarget.id) {
          isAnswering = true;
          // MẤT CON VẬT, HIỂN THỊ ẢNH ELSA & BẠN NGUYÊN VẸN
          const sticker = btn.querySelector('.animal-sticker-layer');
          if (sticker) {
            sticker.classList.add('sticker-vanished');
          }
          btn.classList.add('card-revealed-success', 'bounce-pop');
          window.soundEngine.playSuccess();
          window.createSparkles(btn);
          window.addStar(2);

          window.speechEngine.speak(`${currentTarget.name}! Yes!`);
          setTimeout(pickQuestion, 1500);
        } else {
          window.soundEngine.playBuzzer();
          btn.classList.add('animal-fail-red');
          const failBanner = container.querySelector('#fail-banner');
          if (failBanner) {
            failBanner.style.display = 'block';
            setTimeout(() => { failBanner.style.display = 'none'; }, 1200);
          }
          window.speechEngine.speak("Try again!");
          setTimeout(() => btn.classList.remove('animal-fail-red'), 600);
        }
      };
    });
  }

  pickQuestion();
};

// ==========================================
// 4. ELSA'S MAGIC CINEMA: SHORT VIDEOS ABOUT ELSA & FRIENDS
// ==========================================
window.initMusicHouse = function(container) {
  const elsaVideos = [
    {
      id: "let_it_go",
      title: "Let It Go",
      sub: "Queen Elsa Ice Castle Magic",
      tag: "Disney Sing-Along ❄️",
      thumb: "Image/gallery_08_elsa_magic.jpg",
      youtubeId: "L0MK7qz13bU",
      desc: "Elsa creates her crystal ice palace on North Mountain!"
    },
    {
      id: "show_yourself",
      title: "Show Yourself",
      sub: "Fifth Spirit Transformation",
      tag: "Frozen 2 Sing-Along 🤍",
      thumb: "Image/gallery_03_elsa_spirit.jpeg",
      youtubeId: "md7dK5-qvHc",
      desc: "Elsa discovers her magical destiny at Ahtohallan."
    },
    {
      id: "into_the_unknown",
      title: "Into the Unknown",
      sub: "Enchanted Journey",
      tag: "Magic Journey 🍁",
      thumb: "Image/gallery_02_frozen2_journey.jpg",
      youtubeId: "gIOyB9ZXn8s",
      desc: "Elsa follows the secret siren call into the mystic woods."
    },
    {
      id: "in_summer",
      title: "In Summer (Olaf)",
      sub: "Olaf's Funny Dream & Elsa",
      tag: "Funny Olaf Sing-Along ⛄",
      thumb: "Image/olaf_3d.png",
      youtubeId: "UFatVn1hP3o",
      desc: "Olaf sings about sunshine, heat and warm hugs!"
    },
    {
      id: "snowman",
      title: "Build a Snowman",
      sub: "Young Elsa & Anna",
      tag: "Royal Sisters 👭",
      thumb: "Image/elsa_anna_royal.jpg",
      isSpecialStage: true,
      desc: "Young Anna invites Elsa to come out and play in the snow."
    },
    {
      id: "some_things",
      title: "Some Things Never Change",
      sub: "Elsa, Anna, Olaf & Friends",
      tag: "Frozen 2 Celebration 🍂",
      thumb: "Image/frozen_poster.jpg",
      isSpecialStage: true,
      desc: "Elsa, Anna, Olaf, Kristoff & Sven celebrate friendship in Arendelle!"
    },
    {
      id: "ngocmy_elsa",
      title: "Princess Elsa Ngọc Mỹ",
      sub: "Royal Magic Spotlight",
      tag: "Royal Spotlight 👑",
      thumb: window.getRandomNgocMyImg ? window.getRandomNgocMyImg() : "Image/Ngocmy.jpg",
      isSpecialStage: true,
      desc: "Princess Elsa Ngọc Mỹ and Queen Elsa shine together in royal magic!"
    }
  ];

  let currentVideoIdx = 0;
  let isOfflineTheater = false;
  let offlineSlideshowInterval = null;

  // Pause ambient BGM while watching videos
  window.soundEngine.pauseBackgroundMusic();

  function cleanup() {
    if (offlineSlideshowInterval) {
      clearInterval(offlineSlideshowInterval);
      offlineSlideshowInterval = null;
    }
    window.soundEngine.stopLetItGoSong();
  }

  function render() {
    cleanup();
    const video = elsaVideos[currentVideoIdx];
    const forceOffline = isOfflineTheater || video.isSpecialStage;

    container.innerHTML = `
      <div class="zone-screen cinema-screen-wrap">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🎬 Elsa's Magic Cinema</h2>
          <div class="star-badge" id="cinema-stars">⭐ ${window.getStars()}</div>
        </div>

        <div class="cinema-main-stage">
          <!-- Big Cinema Frame -->
          <div class="cinema-theater-box">
            <div class="cinema-top-crown">👑 Elsa's Royal Screen ✨</div>
            <div class="cinema-viewport" id="cinema-viewport">
              ${forceOffline ? `
                <div class="offline-cinema-player" id="offline-player">
                  <img src="${video.thumb}" class="offline-slide-img" id="cinema-slide-img" alt="${video.title}" />
                  <div class="offline-overlay-controls" id="offline-overlay-controls">
                    <button class="offline-big-play-btn" id="btn-offline-play-song">▶ Play Magic Show ✨</button>
                  </div>
                </div>
              ` : `
                <iframe class="cinema-iframe-player" 
                        id="cinema-iframe"
                        src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&modestbranding=1&rel=0" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
              `}
            </div>

            <!-- Video Info & Mode Toggle (Gọn gàng tối đa khung xem) -->
            <div class="cinema-now-playing-bar compact-cinema-bar">
              <div class="now-playing-info">
                <span class="video-current-title">🎵 ${video.title}</span>
              </div>
              <div class="cinema-action-buttons">
                ${!video.isSpecialStage ? `
                  <button class="cinema-theater-toggle-btn ${isOfflineTheater ? 'active-theater-mode' : ''}" id="btn-toggle-theater-mode">
                    ${isOfflineTheater ? '🌐 Online' : '❄️ Magic Offline'}
                  </button>
                ` : `
                  <span class="video-tag-badge" style="color: #facc15;">✨ Royal Theater</span>
                `}
              </div>
            </div>
          </div>

          <!-- Video Playlist Grid -->
          <div class="cinema-playlist-header">
            <span class="playlist-header-title">✨ Elsa Short Videos Playlist (Tap to Watch):</span>
          </div>

          <div class="cinema-videos-grid">
            ${elsaVideos.map((item, idx) => `
              <button class="cinema-video-card ${idx === currentVideoIdx ? 'active-video-card' : ''}" data-idx="${idx}">
                <div class="video-card-thumb-wrap">
                  <img src="${item.thumb}" class="video-card-thumb" alt="${item.title}" />
                  <span class="video-play-indicator">${idx === currentVideoIdx ? '▶ Playing' : '▶'}</span>
                </div>
                <div class="video-card-details">
                  <span class="video-card-tag">${item.tag}</span>
                  <strong class="video-card-title">${item.title}</strong>
                  <span class="video-card-sub">${item.sub}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Back to map
    container.querySelector('#btn-back-map').onclick = () => {
      cleanup();
      window.soundEngine.playPop();
      if (!window.soundEngine.isBgmDisabled) {
        window.soundEngine.startBackgroundMusic();
      }
      window.showScreen('map');
    };

    // Toggle Offline Theater mode
    const toggleModeBtn = container.querySelector('#btn-toggle-theater-mode');
    if (toggleModeBtn) {
      toggleModeBtn.onclick = () => {
        window.soundEngine.playPop();
        isOfflineTheater = !isOfflineTheater;
        render();
      };
    }

    // Play offline song & start picture slideshow
    const offlinePlayBtn = container.querySelector('#btn-offline-play-song');
    const overlayControls = container.querySelector('#offline-overlay-controls');
    const offlinePlayer = container.querySelector('#offline-player');

    if (offlinePlayBtn) {
      offlinePlayBtn.onclick = () => {
        window.soundEngine.playMagic();
        window.addStar(1);
        const starsEl = container.querySelector('#cinema-stars');
        if (starsEl) starsEl.innerText = `⭐ ${window.getStars()}`;
        window.createSparkles(offlinePlayBtn);

        // Hide overlay controls so the whole photo is 100% visible without text blocking it
        if (overlayControls) {
          overlayControls.style.opacity = '0';
          overlayControls.style.pointerEvents = 'none';
        }

        // Play vocal song
        window.soundEngine.playLetItGoSong((isPlaying) => {
          if (!isPlaying && offlinePlayBtn) {
            offlinePlayBtn.style.display = 'inline-block';
            offlinePlayBtn.innerText = '🔄 Replay Magic Show';
            if (overlayControls) {
              overlayControls.style.opacity = '1';
              overlayControls.style.pointerEvents = 'auto';
            }
          }
        });

        // Slideshow of Elsa, Anna, Olaf & Princess Ngoc My photos (Randomized)
        const slides = [
          video.thumb,
          "Image/Ngocmy.jpg",
          "Image/NgocMy (1).jpg",
          "Image/NgocMy (2).jpg",
          "Image/NgocMy (3).jpg",
          "Image/NgocMy (4).jpg",
          "Image/gallery_04_frozen3_magic.webp",
          "Image/gallery_08_elsa_magic.jpg",
          "Image/gallery_03_elsa_spirit.jpeg",
          "Image/gallery_01_elsa_snow.webp",
          "Image/gallery_07_elsa_castle.jpg",
          "Image/gallery_06_elsa_smile.jpg",
          "Image/elsa_anna_royal.jpg",
          "Image/elsa_portrait.jpg"
        ].sort(() => 0.5 - Math.random());

        let slideIdx = 0;
        const imgEl = container.querySelector('#cinema-slide-img');
        if (imgEl) {
          if (offlineSlideshowInterval) clearInterval(offlineSlideshowInterval);
          offlineSlideshowInterval = setInterval(() => {
            slideIdx = (slideIdx + 1) % slides.length;
            imgEl.style.opacity = '0.3';
            setTimeout(() => {
              imgEl.src = slides[slideIdx];
              imgEl.style.opacity = '1';
            }, 300);
          }, 3200);
        }
      };

      // Tap screen to toggle overlay controls while playing
      if (offlinePlayer) {
        offlinePlayer.onclick = (e) => {
          if (e.target === offlinePlayBtn) return;
          if (overlayControls) {
            const isHidden = overlayControls.style.opacity === '0';
            overlayControls.style.opacity = isHidden ? '1' : '0';
            overlayControls.style.pointerEvents = isHidden ? 'auto' : 'none';
          }
        };
      }
    }

    // Video selection
    container.querySelectorAll('.cinema-video-card').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx !== currentVideoIdx) {
          window.soundEngine.playPop();
          window.createSparkles(btn);
          window.addStar(1);
          currentVideoIdx = idx;
          if (elsaVideos[idx].isSpecialStage) {
            isOfflineTheater = true;
          }
          render();
        }
      };
    });
  }

  render();
};

// ==========================================
// 5. ALPHABET HILL: ELSA ĐỌC CHỮ Ở GIỮA, HÌNH ẢNH MINH HỌA CỰC TO & BẢNG VẼ BĂNG TUYẾT
// ==========================================
window.initIceWandGame = function(container) {
  let currentIndex = 0;
  const alphabet = window.VOCAB_DATA.alphabet;

  function getIllustrationHtml(item) {
    if (item.img) {
      return `<img src="${item.img}" class="giant-badge-img" alt="${item.word}">`;
    }
    if (item.letter === 'E') {
      return `<img src="Image/elsa_3d.png" class="giant-badge-img" alt="Elsa">`;
    }
    if (item.letter === 'O') {
      return `<img src="Image/olaf_3d.png" class="giant-badge-img" alt="Olaf">`;
    }
    if (item.letter === 'S') {
      return `<img src="Image/sven_3d.png" class="giant-badge-img" alt="Sven">`;
    }
    return `<span class="giant-badge-emoji">${item.emoji}</span>`;
  }

  function render() {
    const item = alphabet[currentIndex];
    const illustrationHtml = getIllustrationHtml(item);

    container.innerHTML = `
      <div class="zone-screen letter-screen-wrap">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🔤 Elsa's Alphabet Hill</h2>
          <div class="star-badge" id="alphabet-stars">⭐ ${window.getStars()}</div>
        </div>

        <div class="alphabet-stage-container">
          
          <!-- KHUNG TRÊN NHỎ GỌN: CÔNG CHÚA ELSA ĐỌC CHỮ & MINH HỌA -->
          <div class="alphabet-hero-stage">
            <button class="arrow-nav-btn prev-arrow" id="btn-prev-letter" aria-label="Previous">◀</button>
            
            <div class="alphabet-center-card compact-top-card" id="alphabet-center-card">
              
              <!-- CÔNG CHÚA ELSA ĐỌC CHỮ -->
              <div class="elsa-reading-box" id="elsa-reader-box" title="Tap Elsa to listen!">
                <div class="elsa-speech-bubble" id="elsa-speech-bubble">
                  <span class="speech-quote">"${item.letter} - ${item.word}!"</span>
                  <span class="speech-mic-icon">🔊</span>
                </div>
                <div class="elsa-avatar-wrap">
                  <img src="Image/elsa_3d.png" alt="Princess Elsa" class="elsa-reading-img" id="elsa-reading-avatar">
                  <div class="elsa-glow-ring"></div>
                </div>
                <div class="elsa-tap-hint">Tap Elsa! ✨</div>
              </div>

              <!-- THẺ CHỮ VÀ HÌNH ẢNH MINH HỌA -->
              <div class="letter-illustration-box">
                <div class="letter-giant-symbol" style="color: ${item.color || '#0077b6'}">
                  <span class="sym-cap">${item.letter}</span>
                </div>
                
                <div class="giant-illustration-badge" id="btn-tap-illustration" title="Tap to hear word!">
                  ${illustrationHtml}
                </div>

                <div class="letter-word-banner" id="btn-speak-word">
                  <span class="word-text">${item.word}</span>
                  <button class="sound-chip-btn" aria-label="Listen">🔊</button>
                </div>
              </div>

            </div>

            <button class="arrow-nav-btn next-arrow" id="btn-next-letter" aria-label="Next">▶</button>
          </div>

          <!-- BẢNG VẼ NÉT CHỮ HOA -->
          <div class="tracing-section-wrap">
            <div class="tracing-guide-pill">
              <span>✍️ Trace Letter: <b>${item.letter}</b></span>
            </div>

            <div class="alphabet-trace-row">
              <div class="tracing-board single-trace-board dual-trace-board" id="tracing-board">
                <div class="kindergarten-lines">
                  <div class="k-line k-line-top"></div>
                  <div class="k-line k-line-mid"></div>
                  <div class="k-line k-line-base"></div>
                </div>
                <canvas id="letter-trace-canvas" width="460" height="220"></canvas>
                <div class="guide-dotted-letter single-guide">
                  <span class="guide-cap">${item.letter}</span>
                </div>
              </div>

              <div class="trace-side-controls">
                <button class="letter-tool-btn tool-clear" id="btn-clear-trace">🧹 Clear</button>
                <button class="letter-tool-btn tool-listen" id="btn-listen-trace">🔊 Listen</button>
                <button class="letter-tool-btn tool-sparkle" id="btn-sparkle-trace">✨ Good (+1⭐)</button>
              </div>
            </div>
          </div>

          <!-- THANH CHỌN NHANH CHỮ CÁI TỪ A ĐẾN Z -->
          <div class="letters-ribbon-bar" id="letters-ribbon">
            ${alphabet.map((el, idx) => `
              <button class="ribbon-letter-btn ${idx === currentIndex ? 'active-ribbon-letter' : ''}" data-idx="${idx}">
                ${el.letter}
              </button>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    // SỰ KIỆN ĐIỀU HƯỚNG & TƯƠNG TÁC
    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelector('#btn-prev-letter').onclick = () => {
      window.soundEngine.playPop();
      currentIndex = (currentIndex - 1 + alphabet.length) % alphabet.length;
      render();
      speakCurrent();
    };

    container.querySelector('#btn-next-letter').onclick = () => {
      window.soundEngine.playPop();
      currentIndex = (currentIndex + 1) % alphabet.length;
      render();
      speakCurrent();
    };

    // Chạm vào Elsa hoặc bong bóng thoại để Elsa phát âm
    const elsaBox = container.querySelector('#elsa-reader-box');
    if (elsaBox) {
      elsaBox.onclick = () => {
        animateElsa();
        speakCurrent();
      };
    }

    // Chạm vào hình minh họa hoặc chữ
    const illustBox = container.querySelector('#btn-tap-illustration');
    if (illustBox) {
      illustBox.onclick = () => {
        window.soundEngine.playPop();
        window.createSparkles(illustBox);
        speakCurrent();
      };
    }

    const wordBanner = container.querySelector('#btn-speak-word');
    if (wordBanner) {
      wordBanner.onclick = () => {
        window.soundEngine.playPop();
        speakCurrent();
      };
    }

    container.querySelector('#btn-listen-trace').onclick = () => {
      window.soundEngine.playPop();
      window.speechEngine.speak(`${item.letter}! ${item.word}!`);
    };

    container.querySelector('#btn-clear-trace').onclick = () => {
      window.soundEngine.playPop();
      clearCanvas();
    };

    container.querySelector('#btn-sparkle-trace').onclick = () => {
      window.soundEngine.playSuccess();
      window.createSparkles(container.querySelector('#tracing-board'));
      window.addStar(1);
      const starsEl = container.querySelector('#alphabet-stars');
      if (starsEl) starsEl.innerText = `⭐ ${window.getStars()}`;
      animateElsa();
      window.speechEngine.speak(`Good job! Letter ${item.letter}!`);
    };

    // Thanh ribbon A-Z
    container.querySelectorAll('.ribbon-letter-btn').forEach(btn => {
      btn.onclick = (e) => {
        const targetIdx = parseInt(btn.dataset.idx, 10);
        if (!isNaN(targetIdx) && targetIdx !== currentIndex) {
          window.soundEngine.playPop();
          currentIndex = targetIdx;
          render();
          speakCurrent();
        }
      };
    });

    // Cuộn ribbon đến chữ đang chọn (chỉ cuộn ngang thanh ribbon, không làm nhảy cuộn trang)
    const ribbon = container.querySelector('#letters-ribbon');
    const activeRibbonBtn = container.querySelector('.active-ribbon-letter');
    if (ribbon && activeRibbonBtn) {
      ribbon.scrollLeft = activeRibbonBtn.offsetLeft - (ribbon.clientWidth / 2) + (activeRibbonBtn.clientWidth / 2);
    }

    initCanvas();
  }

  function animateElsa() {
    const avatar = container.querySelector('#elsa-reading-avatar');
    if (avatar) {
      avatar.classList.remove('elsa-reading-bounce');
      void avatar.offsetWidth; // force reflow
      avatar.classList.add('elsa-reading-bounce');
      window.createSparkles(avatar.parentElement);
    }
  }

  function speakCurrent() {
    const item = alphabet[currentIndex];
    // Elsa đọc chữ hoa và từ vựng
    window.speechEngine.speak(`${item.letter}! ${item.word}!`);
  }

  function clearCanvas() {
    const canvas = container.querySelector('#letter-trace-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function initCanvas() {
    const canvas = container.querySelector('#letter-trace-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function start(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      window.soundEngine.playPop();
    }

    function move(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stop(e) {
      if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
      }
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
  }

  render();
  setTimeout(speakCurrent, 300);
};

// ==========================================
// 6. GOOD HABITS: 10 CÂU CỰC KỲ NGẮN GỌN & DỄ NHỚ CHO BÉ
// ==========================================
window.initGoodHabits = function(container) {
  const habits = [
    { id: 'hands', phrase: 'Wash Hands with Elsa!', icon: '🧼', desc: 'Clean & Fresh ❄️' },
    { id: 'teeth', phrase: 'Brush Teeth like Elsa!', icon: '🪥', desc: 'Sparkly Smile ✨' },
    { id: 'veggies', phrase: 'Eat Veggies with Elsa!', icon: '🥦', desc: 'Grow Strong 💪' },
    { id: 'water', phrase: 'Drink Water like Elsa!', icon: '💧', desc: 'Crystal Fresh 🧊' },
    { id: 'toys', phrase: 'Tidy Toys with Elsa!', icon: '🧸', desc: 'Royal Castle Clean 🏰' },
    { id: 'please', phrase: 'Say Please to Queen Elsa!', icon: '🙏', desc: 'Polite Princess 💖' },
    { id: 'thanks', phrase: 'Say Thank You to Elsa!', icon: '💖', desc: 'Kind & Sweet 🌸' },
    { id: 'sleep', phrase: 'Sleep Early with Elsa!', icon: '🌙', desc: 'Sweet Dreams 💤' },
    { id: 'share', phrase: 'Share with Elsa & Friends!', icon: '🎁', desc: 'Royal Caring 💕' },
    { id: 'hug', phrase: 'Warm Hug for Elsa & Olaf!', icon: '🥰', desc: 'Magic Warm Hugs ⛄' }
  ];

  function render() {
    container.innerHTML = `
      <div class="zone-screen habits-bg">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">💖 Elsa's Royal Habits</h2>
          <div class="star-badge">⭐ ${window.getStars()}</div>
        </div>

        <div class="habits-header-bubble">
          <img src="Image/elsa_3d.png" class="guide-avatar" alt="Queen Elsa" />
          <div class="speech-bubble">
            <p style="font-size: 13px; color: #475569; margin: 0 0 2px;">Princess Daily Habits</p>
            <p><strong style="font-size: 18px; color: #0284c7;">Elsa's Royal Habits! 👑</strong></p>
          </div>
        </div>

        <!-- LƯỚI 10 CÂU NGẮN CHO BÉ CHẠM -->
        <div class="habits-grid-10">
          ${habits.map(h => `
            <button class="habit-tile-btn" data-phrase="${h.phrase}">
              <span class="habit-tile-emoji">${h.icon}</span>
              <strong class="habit-tile-text">${h.phrase}</strong>
              <span class="habit-tile-sub">${h.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelectorAll('.habit-tile-btn').forEach(btn => {
      btn.onclick = () => {
        const phrase = btn.dataset.phrase;
        btn.classList.add('bounce-pop');
        window.soundEngine.playMagic();
        window.createSparkles(btn);
        window.addStar(1);
        window.speechEngine.speak(phrase);
        setTimeout(() => btn.classList.remove('bounce-pop'), 400);
      };
    });
  }

  render();
};

// ==========================================
// 7. STICKER ALBUM (CHỈ ĐỌC TÊN NHÂN VẬT, KHÔNG ĐỌC LẶP "STICKER")
// ==========================================
window.initStickerAlbum = function(container) {
  const stars = window.getStars();
  const stickers = [
    { id: 1, name: 'Elsa', img: 'Image/elsa_3d.png', cost: 0 },
    { id: 2, name: 'Olaf', img: 'Image/olaf_3d.png', cost: 4 },
    { id: 3, name: 'Anna', img: 'Image/anna_3d.png', cost: 8 },
    { id: 4, name: 'Sven', img: 'Image/sven_3d.png', cost: 12 },
    { id: 5, name: 'Kristoff', img: 'Image/kristoff_3d.png', cost: 16 },
    { id: 6, name: 'Princesses', img: 'Image/elsa_anna_royal.jpg', cost: 20 },
    { id: 7, name: 'Crown', img: 'assets/images/crown.svg', cost: 25 },
    { id: 8, name: 'Castle', img: 'assets/images/castle.svg', cost: 30 }
  ];

  function render() {
    container.innerHTML = `
      <div class="zone-screen">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">🌟 Elsa's Royal Stickers</h2>
          <div class="star-badge">⭐ ${stars}</div>
        </div>

        <div class="sticker-stage">
          <div class="sticker-grid">
            ${stickers.map(s => {
              const unlocked = stars >= s.cost;
              return `
                <div class="sticker-card ${unlocked ? 'unlocked' : 'locked'}" data-name="${s.name}" data-unlocked="${unlocked}">
                  <div class="sticker-img-box">
                    <img src="${s.img}" class="sticker-img" alt="${s.name}" />
                    ${!unlocked ? `<div class="lock-tag">🔒 ${s.cost} ⭐</div>` : `<div class="spark-tag">✨ Unlocked!</div>`}
                  </div>
                  <div class="sticker-name">${s.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelectorAll('.sticker-card').forEach(card => {
      card.onclick = () => {
        const unlocked = card.dataset.unlocked === 'true';
        const name = card.dataset.name;
        if (unlocked) {
          window.soundEngine.playMagic();
          window.createSparkles(card);
          // CHỈ ĐỌC TÊN: "Elsa!", "Olaf!", KHÔNG ĐỌC LẶP TỪ "STICKER"
          window.speechEngine.speak(`${name}!`);
        } else {
          window.soundEngine.playBuzzer();
          window.speechEngine.speak("Play more games!");
        }
      };
    });
  }

  render();
};
