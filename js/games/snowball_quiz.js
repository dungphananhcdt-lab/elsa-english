// Snowball Quiz ("Where is it?" Game for toddlers)
window.initSnowballQuiz = function(container) {
  let pool = [];
  let currentTarget = null;
  let options = [];
  let isAnswering = false;

  // Build a flat list of recognizable items
  function preparePool() {
    pool = [];
    ['frozen', 'animals', 'foods', 'colors'].forEach(cat => {
      if (window.VOCAB_DATA[cat]) {
        window.VOCAB_DATA[cat].items.forEach(item => {
          pool.push(item);
        });
      }
    });
  }

  function pickQuestion() {
    isAnswering = false;
    // Pick 1 target
    currentTarget = pool[Math.floor(Math.random() * pool.length)];

    // Pick 2 other random distractors
    const others = pool.filter(i => i.id !== currentTarget.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 2);

    options = [currentTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    render();

    // Elsa asks the question with gentle delay
    setTimeout(() => {
      window.speechEngine.speak(`Can you find the ${currentTarget.word}?`);
    }, 400);
  }

  function render() {
    container.innerHTML = `
      <div class="game-header">
        <button class="back-btn" id="btn-back-home">🏰 Home</button>
        <h2 class="game-title">❄️ Snowball Match</h2>
        <div class="star-badge" id="header-stars">⭐ ${window.getStars()}</div>
      </div>

      <div class="quiz-instruction-box">
        <img src="assets/images/elsa.svg" class="quiz-elsa-avatar" alt="Elsa" />
        <div class="quiz-speech-bubble" id="quiz-prompt">
          <p class="bubble-text">Where is the <strong>"${currentTarget.word}"</strong>?</p>
          <button class="repeat-sound-btn" id="btn-repeat-sound">🔊 Listen Again</button>
        </div>
      </div>

      <div class="quiz-options-container">
        ${options.map(item => `
          <div class="quiz-card" data-id="${item.id}" style="--accent: ${item.color || '#48CAE4'}">
            <div class="quiz-card-visual">
              ${item.img ? `<img src="${item.img}" alt="${item.word}" class="quiz-img" />` : ''}
              ${item.emoji ? `<span class="quiz-emoji">${item.emoji}</span>` : ''}
            </div>
            <div class="quiz-card-name">${item.word}</div>
          </div>
        `).join('')}
      </div>

      <div class="celebrate-banner" id="celebrate-banner" style="display: none;">
        ✨ Great Job! +2 Stars ⭐⭐
      </div>
    `;

    // Events
    container.querySelector('#btn-back-home').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('home');
    };

    container.querySelector('#btn-repeat-sound').onclick = () => {
      window.soundEngine.playPop();
      window.speechEngine.speak(`Can you find the ${currentTarget.word}?`);
    };

    container.querySelectorAll('.quiz-card').forEach(card => {
      card.onclick = () => handleChoice(card);
    });
  }

  function handleChoice(card) {
    if (isAnswering) return;
    const selectedId = card.dataset.id;

    if (selectedId === currentTarget.id) {
      // Correct!
      isAnswering = true;
      card.classList.add('correct-card');
      window.soundEngine.playSuccess();
      window.createSparkles(card);
      window.addStar(2);

      const banner = container.querySelector('#celebrate-banner');
      if (banner) banner.style.display = 'block';

      const starsEl = container.querySelector('#header-stars');
      if (starsEl) starsEl.innerText = `⭐ ${window.getStars()}`;

      window.speechEngine.praise();

      setTimeout(() => {
        pickQuestion();
      }, 2200);
    } else {
      // Gentle incorrect shake
      card.classList.add('shake-card');
      window.soundEngine.playTryAgain();
      window.speechEngine.encourage();
      setTimeout(() => card.classList.remove('shake-card'), 600);
    }
  }

  preparePool();
  pickQuestion();
};

