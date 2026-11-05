// Elsa's Magic Castle & Rewards Collection
window.initCastleRewards = function(container) {
  const rewards = [
    { id: "tiara", name: "Royal Ice Tiara", cost: 5, icon: "assets/images/crown.svg", desc: "Vương miện lấp lánh" },
    { id: "wand", name: "Crystal Wand", cost: 10, icon: "assets/images/wand.svg", desc: "Đũa phép băng giá" },
    { id: "snowflake", name: "Magic Snowflake", cost: 15, icon: "assets/images/snowflake.svg", desc: "Bông tuyết pha lê" },
    { id: "castle", name: "Grand Ice Castle", cost: 25, icon: "assets/images/castle.svg", desc: "Lâu đài hoàng gia" }
  ];

  function render() {
    const stars = window.getStars();

    container.innerHTML = `
      <div class="game-header">
        <button class="back-btn" id="btn-back-home">🏰 Home</button>
        <h2 class="game-title">👑 Magic Castle</h2>
        <div class="star-badge" id="header-stars">⭐ ${stars}</div>
      </div>

      <div class="castle-stage">
        <div class="castle-hero">
          <img src="assets/images/castle.svg" class="castle-stage-img" alt="Ice Castle" />
          <div class="castle-title-wrap">
            <h3 class="castle-headline">Your Star Kingdom ✨</h3>
            <p class="castle-subtext">Earn stars by playing games to unlock Elsa's magic treasures!</p>
          </div>
        </div>

        <div class="rewards-grid">
          ${rewards.map(item => {
            const isUnlocked = stars >= item.cost;
            return `
              <div class="reward-card ${isUnlocked ? 'unlocked' : 'locked'}" data-name="${item.name}" data-unlocked="${isUnlocked}">
                <div class="reward-icon-box">
                  <img src="${item.icon}" class="reward-img" alt="${item.name}" />
                  ${!isUnlocked ? `<div class="lock-overlay">🔒 ${item.cost} ⭐</div>` : `<div class="unlocked-badge">✨ Unlocked!</div>`}
                </div>
                <div class="reward-name">${item.name}</div>
                <div class="reward-desc">${item.desc}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-back-home').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('home');
    };

    container.querySelectorAll('.reward-card').forEach(card => {
      card.onclick = () => {
        const isUnlocked = card.dataset.unlocked === 'true';
        const name = card.dataset.name;

        if (isUnlocked) {
          window.soundEngine.playMagic();
          window.createSparkles(card);
          window.speechEngine.speak(`You unlocked the ${name}! You are a wonderful princess!`);
        } else {
          window.soundEngine.playTryAgain();
          window.speechEngine.speak(`Play more games to unlock the ${name}!`);
        }
      };
    });
  }

  render();
};

