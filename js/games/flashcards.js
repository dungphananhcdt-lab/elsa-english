// Flashcard Mini-Game (Magic Cards of Arendelle)
window.initFlashcardsGame = function(container) {
  let currentCategory = 'frozen';
  const categories = Object.keys(window.VOCAB_DATA).filter(k => k !== 'alphabet');

  function render() {
    container.innerHTML = `
      <div class="game-header">
        <button class="back-btn" id="btn-back-home">🏰 Home</button>
        <h2 class="game-title">❄️ Magic Flashcards</h2>
        <div class="star-badge" id="header-stars">⭐ 0</div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills">
        ${categories.map(catKey => `
          <button class="cat-pill ${catKey === currentCategory ? 'active' : ''}" data-cat="${catKey}">
            ${window.VOCAB_DATA[catKey].name}
          </button>
        `).join('')}
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid" id="cards-grid">
        ${renderCards(currentCategory)}
      </div>
    `;

    // Bind Back Button
    container.querySelector('#btn-back-home').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('home');
    };

    // Bind Category Pills
    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.onclick = (e) => {
        window.soundEngine.playPop();
        currentCategory = btn.dataset.cat;
        render();
      };
    });

    bindCardEvents();
    updateStarsDisplay();
  }

  function renderCards(catKey) {
    const data = window.VOCAB_DATA[catKey];
    return data.items.map(item => `
      <div class="magic-card" data-word="${item.word}" data-vn="${item.vn}" style="--accent: ${item.color || '#48CAE4'}">
        <div class="card-inner">
          <div class="card-visual">
            ${item.img ? `<img src="${item.img}" alt="${item.word}" class="card-img" />` : ''}
            ${item.emoji ? `<span class="card-emoji">${item.emoji}</span>` : ''}
            ${item.num ? `<span class="card-num">${item.num}</span>` : ''}
          </div>
          <div class="card-word">${item.word}</div>
          <div class="card-sub">${item.vn}</div>
          <button class="card-speaker-btn">🔊</button>
        </div>
      </div>
    `).join('');
  }

  function bindCardEvents() {
    container.querySelectorAll('.magic-card').forEach(card => {
      card.onclick = () => {
        const word = card.dataset.word;
        const vn = card.dataset.vn;

        // Visual bounce & magic particle
        card.classList.add('card-bounce');
        setTimeout(() => card.classList.remove('card-bounce'), 500);

        window.soundEngine.playMagic();
        window.createSparkles(card);
        window.speechEngine.speak(word);
        window.addStar(1);
        updateStarsDisplay();
      };
    });
  }

  function updateStarsDisplay() {
    const el = container.querySelector('#header-stars');
    if (el) el.innerText = `⭐ ${window.getStars()}`;
  }

  render();
};

