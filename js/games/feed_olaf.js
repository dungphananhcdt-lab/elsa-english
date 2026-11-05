// Feed Princess Elsa Mini-Game (Interactive Drag & Drop Feeding for Toddlers)
window.initFeedOlafGame = function(container) {
  const foodItems = [
    { id: "strawberry", word: "Strawberry", icon: "🍓" },
    { id: "cupcake", word: "Cupcake", icon: "🧁" },
    { id: "apple", word: "Apple", icon: "🍎" },
    { id: "icecream", word: "Ice Cream", icon: "🍦" },
    { id: "cake", word: "Cake", icon: "🎂" },
    { id: "cookie", word: "Cookie", icon: "🍪" },
    { id: "donut", word: "Donut", icon: "🍩" },
    { id: "watermelon", word: "Watermelon", icon: "🍉" },
    { id: "grapes", word: "Grapes", icon: "🍇" },
    { id: "cherry", word: "Cherry", icon: "🍒" }
  ];

  let currentTarget = null;
  let options = [];
  let isFeeding = false;

  function pickTarget() {
    isFeeding = false;
    currentTarget = foodItems[Math.floor(Math.random() * foodItems.length)];
    const others = foodItems.filter(f => f.id !== currentTarget.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    options = [currentTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    render();

    // Elsa asks for food
    setTimeout(() => {
      window.speechEngine.speak(`${currentTarget.word}! Feed Elsa!`);
    }, 250);
  }

  function render() {
    container.innerHTML = `
      <div class="zone-screen feed-screen-wrap">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Map</button>
          <h2 class="zone-title">👑 Feed Princess Elsa</h2>
          <div class="star-badge" id="header-stars">⭐ ${window.getStars()}</div>
        </div>

        <div class="feed-stage-box">
          
          <!-- Elsa Character & Royal Feeding Target -->
          <div class="elsa-feed-hero" id="elsa-feed-target">
            <div class="elsa-crown-halo">✨ 👑 ✨</div>
            <img src="Image/elsa_3d.png" alt="Princess Elsa" class="elsa-stage-img-3d" id="elsa-avatar-img" />
            
            <div class="elsa-feed-bubble" id="elsa-speech-bubble">
              Princess Elsa is hungry: <br/>
              <strong style="font-size: 22px; color: #0284c7;">Feed me ${currentTarget.word} ${currentTarget.icon}!</strong>
            </div>

            <!-- Glowing Royal Plate (Drop Zone) -->
            <div class="royal-plate-dropzone" id="royal-plate">
              <span class="plate-dish-emoji">🍽️</span>
              <span class="plate-drop-hint">Drop food here ✨</span>
            </div>
          </div>

          <div class="feed-guide-pill">
            <span>👆 Drag <b>${currentTarget.word} ${currentTarget.icon}</b> to Elsa's plate!</span>
          </div>

          <!-- 4 Delicious Food Choices (Draggable Cards) -->
          <div class="food-tray-grid" id="food-tray">
            ${options.map(item => `
              <div class="food-card-btn draggable-food-card" 
                   data-id="${item.id}" 
                   data-word="${item.word}"
                   id="food-card-${item.id}">
                <span class="food-card-emoji">${item.icon}</span>
                <span class="food-card-name">${item.word}</span>
                <span class="drag-handle-hint">Drag ✥</span>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    // Back to map
    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    // Tap Elsa to speak
    const elsaHero = container.querySelector('#elsa-feed-target');
    if (elsaHero) {
      elsaHero.onclick = (e) => {
        // Only if not dropping
        if (e.target.closest('.royal-plate-dropzone') || e.target.closest('#elsa-avatar-img')) {
          window.soundEngine.playPop();
          window.speechEngine.speak(`${currentTarget.word}! Feed Elsa!`);
        }
      };
    }

    // Initialize Drag & Drop + Tap fallback on food cards
    initDragAndDrop();
  }

  function initDragAndDrop() {
    const foodCards = container.querySelectorAll('.draggable-food-card');
    const dropTarget = container.querySelector('#royal-plate');
    const elsaBox = container.querySelector('#elsa-feed-target');

    foodCards.forEach(card => {
      let isDragging = false;
      let startX = 0, startY = 0;
      let currentX = 0, currentY = 0;
      let hasMovedSignificantly = false;

      function onDragStart(clientX, clientY) {
        if (isFeeding) return;
        isDragging = true;
        hasMovedSignificantly = false;
        startX = clientX;
        startY = clientY;

        card.classList.add('is-dragging-card');
        dropTarget.classList.add('plate-glow-waiting');
        window.soundEngine.playPop();
      }

      function onDragMove(clientX, clientY) {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;

        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          hasMovedSignificantly = true;
        }

        currentX = clientX;
        currentY = clientY;

        card.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;
        card.style.zIndex = '999';

        // Check if hovering over plate
        const plateRect = dropTarget.getBoundingClientRect();
        if (clientX >= plateRect.left && clientX <= plateRect.right &&
            clientY >= plateRect.top && clientY <= plateRect.bottom) {
          dropTarget.classList.add('plate-hover-ready');
        } else {
          dropTarget.classList.remove('plate-hover-ready');
        }
      }

      function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('is-dragging-card');
        dropTarget.classList.remove('plate-glow-waiting');
        dropTarget.classList.remove('plate-hover-ready');

        // Check if dropped onto Elsa or Royal Plate
        const plateRect = dropTarget.getBoundingClientRect();
        const elsaRect = elsaBox.getBoundingClientRect();

        const droppedInTarget = (
          (currentX >= plateRect.left - 20 && currentX <= plateRect.right + 20 &&
           currentY >= plateRect.top - 20 && currentY <= plateRect.bottom + 20) ||
          (currentX >= elsaRect.left && currentX <= elsaRect.right &&
           currentY >= elsaRect.top && currentY <= elsaRect.bottom)
        );

        if (hasMovedSignificantly && droppedInTarget) {
          handleFoodDelivery(card);
        } else if (!hasMovedSignificantly) {
          // If child just tapped instead of dragging: also deliver!
          handleFoodDelivery(card);
        } else {
          // Snap back smoothly
          card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.transform = 'translate(0px, 0px) scale(1)';
          setTimeout(() => {
            card.style.transition = '';
            card.style.zIndex = '';
          }, 320);
        }
      }

      // Pointer / Touch Events
      card.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        onDragStart(e.clientX, e.clientY);

        const onPointerMove = (ev) => {
          onDragMove(ev.clientX, ev.clientY);
        };
        const onPointerUp = () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          onDragEnd();
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });

      // Touch fallback for older iOS Safari
      card.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          onDragStart(t.clientX, t.clientY);
        }
      }, { passive: false });

      card.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
          e.preventDefault();
          const t = e.touches[0];
          onDragMove(t.clientX, t.clientY);
        }
      }, { passive: false });

      card.addEventListener('touchend', () => {
        if (isDragging) {
          onDragEnd();
        }
      });
    });
  }

  function handleFoodDelivery(card) {
    if (isFeeding) return;
    const foodId = card.dataset.id;
    const foodWord = card.dataset.word;
    const elsaImg = container.querySelector('#elsa-avatar-img');
    const elsaSpeech = container.querySelector('#elsa-speech-bubble');
    const plate = container.querySelector('#royal-plate');

    if (foodId === currentTarget.id) {
      isFeeding = true;

      // Animate card flying onto plate
      card.style.transition = 'all 0.4s ease-out';
      card.classList.add('food-delivered-success');
      
      if (elsaImg) elsaImg.classList.add('elsa-happy-eating');
      if (plate) plate.classList.add('plate-food-arrived');

      setTimeout(() => {
        window.soundEngine.playSuccess();
        window.createSparkles(plate);
        window.createSparkles(elsaImg);
        window.addStar(2);

        if (elsaSpeech) {
          elsaSpeech.innerHTML = `✨ <strong>Yummy! Thank you!</strong> <br/><span style="color:#e11d48;">Elsa loves ${foodWord}! 💖</span>`;
        }

        const starsEl = container.querySelector('#header-stars');
        if (starsEl) starsEl.innerText = `⭐ ${window.getStars()}`;

        window.speechEngine.speak(`Yummy! Delicious ${foodWord}! Thank you darling!`);
      }, 350);

      setTimeout(() => {
        if (elsaImg) elsaImg.classList.remove('elsa-happy-eating');
        pickTarget();
      }, 2000);

    } else {
      // Wrong food: Soft chime + gentle snap back
      window.soundEngine.playBuzzer();
      card.style.transition = 'transform 0.3s ease';
      card.style.transform = 'translate(0px, 0px) scale(1)';
      card.classList.add('fail-pick');
      
      window.speechEngine.speak(`Oops! Elsa wants the ${currentTarget.word}!`);
      setTimeout(() => {
        card.classList.remove('fail-pick');
        card.style.transition = '';
        card.style.zIndex = '';
      }, 600);
    }
  }

  pickTarget();
};
