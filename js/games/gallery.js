// Elsa & Ngoc My Royal Photo Puzzle (Jigsaw Puzzle 4 or 6 Frames for Toddlers)
(function() {
  const PUZZLE_PHOTOS = [
    // --- 11 Ảnh Công Chúa Elsa Ngọc Mỹ Trọn Bộ (JPG & PNG) ---
    { id: 1, name: "Elsa Ngọc Mỹ", title: "Princess Elsa Ngọc Mỹ 👑", url: "Image/Ngocmy.jpg", tag: "Princess" },
    { id: 2, name: "Ngọc Mỹ Winter Fairy", title: "Princess Ngọc Mỹ Snow ❄️", url: "Image/NgocMy (1).jpg", tag: "Princess" },
    { id: 3, name: "Ngọc Mỹ Royal Tiara", title: "Princess Ngọc Mỹ Tiara 👑", url: "Image/NgocMy (2).jpg", tag: "Princess" },
    { id: 4, name: "Ngọc Mỹ Sweet Smile", title: "Princess Ngọc Mỹ Smile 💖", url: "Image/NgocMy (3).jpg", tag: "Princess" },
    { id: 5, name: "Ngọc Mỹ Ice Castle", title: "Princess Ngọc Mỹ Gown 💎", url: "Image/NgocMy (4).jpg", tag: "Princess" },
    { id: 6, name: "Ngọc Mỹ Flower Fairy", title: "Princess Ngọc Mỹ Flower 🌸", url: "Image/NgocMy (1).png", tag: "Princess" },
    { id: 7, name: "Ngọc Mỹ Royal Sparkle", title: "Princess Ngọc Mỹ Sparkle ✨", url: "Image/NgocMy (2).png", tag: "Princess" },
    { id: 8, name: "Ngọc Mỹ Little Angel", title: "Princess Ngọc Mỹ Angel 🤍", url: "Image/NgocMy (3).png", tag: "Princess" },
    { id: 9, name: "Ngọc Mỹ Cute Ribbon", title: "Princess Ngọc Mỹ Ribbon 🎀", url: "Image/NgocMy (4).png", tag: "Princess" },
    { id: 10, name: "Ngọc Mỹ Sunshine Magic", title: "Princess Ngọc Mỹ Sunshine ☀️", url: "Image/NgocMy (5).png", tag: "Princess" },
    { id: 11, name: "Ngọc Mỹ Magic Wand", title: "Princess Ngọc Mỹ Magic Wand 🪄", url: "Image/NgocMy (6).png", tag: "Princess" },

    // --- Ảnh Hoạt Cảnh Frozen 3, Elsa & Những Người Bạn ---
    { id: 12, name: "Queen Elsa Magic", title: "Queen Elsa Magic ❄️", url: "Image/gallery_08_elsa_magic.jpg", tag: "Elsa" },
    { id: 13, name: "Frozen 3 Magic", title: "Frozen 3 Magic Kingdom ✨", url: "Image/gallery_04_frozen3_magic.webp", tag: "Magic" },
    { id: 14, name: "Royal Sisters", title: "Elsa & Anna Royal 👑", url: "Image/elsa_anna_royal.jpg", tag: "Royal" },
    { id: 15, name: "Frozen Friends", title: "Olaf & Friends ⛄", url: "Image/frozen_poster.jpg", tag: "Friends" },
    { id: 16, name: "Ice Castle", title: "Crystal Ice Castle 🏰", url: "Image/gallery_07_elsa_castle.jpg", tag: "Castle" },
    { id: 17, name: "Fifth Spirit", title: "Fifth Spirit Elsa 🤍", url: "Image/gallery_03_elsa_spirit.jpeg", tag: "Spirit" },
    { id: 18, name: "Magic Forest", title: "Enchanted Journey 🍁", url: "Image/gallery_02_frozen2_journey.jpg", tag: "Journey" },
    { id: 19, name: "Winter Magic", title: "Winter Frost ❄️", url: "Image/gallery_01_elsa_snow.webp", tag: "Magic" },
    { id: 20, name: "Crystal Gown", title: "Elsa Sparkling Dress 💎", url: "Image/gallery_05_elsa_dress.jpg", tag: "Fashion" },
    { id: 21, name: "Elsa Smile", title: "Queen Elsa Smile 👑", url: "Image/gallery_06_elsa_smile.jpg", tag: "Smile" },
    { id: 22, name: "Frost Power", title: "Winter Frost Power ❄️", url: "Image/gallery_09_elsa_power.jpg", tag: "Power" },
    { id: 23, name: "Royal Portrait", title: "Princess Elsa Portrait 💙", url: "Image/elsa_portrait.jpg", tag: "Portrait" },
    { id: 24, name: "Queen Elsa 3D", title: "Queen Elsa 3D ❄️", url: "Image/elsa_3d.png", tag: "Elsa" },
    { id: 25, name: "Princess Anna 3D", title: "Princess Anna 3D 🌸", url: "Image/anna_3d.png", tag: "Anna" },
    { id: 26, name: "Olaf 3D", title: "Olaf the Snowman ⛄", url: "Image/olaf_3d.png", tag: "Olaf" },
    { id: 27, name: "Sven 3D", title: "Sven the Reindeer 🦌", url: "Image/sven_3d.png", tag: "Friends" }
  ];

  window.initGalleryZone = function(container) {
    // Random chọn ảnh bắt đầu từ 11 ảnh của công chúa Ngọc Mỹ
    let currentPhotoIdx = Math.floor(Math.random() * 11);
    let pieceMode = 4; // 4 or 6 frames
    let placedIndices = new Set();
    let selectedPieceIdx = null; // for tap-to-place
    let showHint = true;
    let isVictory = false;

    function getGridConfig() {
      if (pieceMode === 6) {
        return { cols: 3, rows: 2, count: 6 };
      }
      return { cols: 2, rows: 2, count: 4 };
    }

    function initPuzzleState() {
      placedIndices.clear();
      selectedPieceIdx = null;
      isVictory = false;
    }

    function render() {
      const photo = PUZZLE_PHOTOS[currentPhotoIdx];
      const grid = getGridConfig();
      const allDone = placedIndices.size === grid.count;

      container.innerHTML = `
        <div class="zone-screen puzzle-screen-wrap">
          <!-- Header -->
          <div class="zone-header">
            <button class="back-btn" id="btn-back-map">🗺️ Map</button>
            <h2 class="zone-title">🧩 Elsa's Photo Puzzle</h2>
            <div class="star-badge" id="puzzle-stars">⭐ ${window.getStars()}</div>
          </div>

          <!-- Mode Controls: 4 Frames vs 6 Frames & Hint -->
          <div class="puzzle-controls-bar">
            <div class="mode-pill-group">
              <button class="mode-select-btn ${pieceMode === 4 ? 'active-mode' : ''}" id="btn-mode-4">
                🧩 4 Frames (2x2)
              </button>
              <button class="mode-select-btn ${pieceMode === 6 ? 'active-mode' : ''}" id="btn-mode-6">
                🧩 6 Frames (3x2)
              </button>
            </div>
            
            <div class="hint-action-group">
              <button class="puzzle-hint-btn ${showHint ? 'hint-on' : ''}" id="btn-toggle-hint" title="Toggle guide watermark">
                💡 Hint: ${showHint ? 'ON' : 'OFF'}
              </button>
              <button class="puzzle-next-btn" id="btn-next-photo" title="Next picture">
                Next ⏭️
              </button>
            </div>
          </div>

          <!-- Picture Selection Ribbon -->
          <div class="puzzle-photo-ribbon" id="photo-ribbon">
            ${PUZZLE_PHOTOS.map((item, idx) => `
              <button class="ribbon-photo-item ${idx === currentPhotoIdx ? 'active-ribbon-photo' : ''}" data-idx="${idx}">
                <img src="${item.url}" class="ribbon-photo-thumb" alt="${item.title}" />
                ${idx === currentPhotoIdx ? '<span class="ribbon-crown-tag">👑</span>' : ''}
              </button>
            `).join('')}
          </div>

          <div class="puzzle-photo-title-pill">
            <span>${photo.title}</span>
          </div>

          <!-- Main Puzzle Stage -->
          <div class="puzzle-stage-container">
            
            <!-- Target Puzzle Board (Grid of Slots during assembly, or 100% Seamless Photo when solved) -->
            <div class="puzzle-board-card ${allDone ? 'puzzle-board-solved' : ''} ${pieceMode === 6 ? 'mode-6-board' : 'mode-4-board'}" 
                 id="puzzle-board"
                 style="--grid-cols: ${grid.cols}; --grid-rows: ${grid.rows};">
              
              ${allDone ? `
                <!-- HOÀN THÀNH: ẢNH NGUYÊN VẸN LIỀN MẠCH 100% KHÔNG CÓ BẤT KỲ ĐƯỜNG KẺ NGĂN CÁCH NÀO -->
                <div class="puzzle-solved-full-wrapper" id="puzzle-solved-wrap">
                  <img src="${photo.url}" class="puzzle-solved-full-img" alt="${photo.title}" />
                  <div class="puzzle-solved-sparkle-layer">✨</div>
                </div>
              ` : `
                <!-- Subtle Background Watermark Guide -->
                <div class="puzzle-watermark-guide ${showHint ? 'show-hint-guide' : ''}"
                     style="background-image: url('${photo.url}');">
                </div>

                ${Array.from({ length: grid.count }).map((_, idx) => {
                  const col = idx % grid.cols;
                  const row = Math.floor(idx / grid.cols);
                  const isPlaced = placedIndices.has(idx);

                  const bgPosX = grid.cols > 1 ? (col / (grid.cols - 1)) * 100 : 0;
                  const bgPosY = grid.rows > 1 ? (row / (grid.rows - 1)) * 100 : 0;
                  const bgSizeX = grid.cols * 100;
                  const bgSizeY = grid.rows * 100;

                  return `
                    <div class="puzzle-slot-box ${isPlaced ? 'slot-filled' : 'slot-empty'}"
                         data-slot-idx="${idx}"
                         data-col="${col}"
                         data-row="${row}"
                         id="slot-${idx}">
                      ${isPlaced ? `
                        <div class="puzzle-placed-piece"
                             style="background-image: url('${photo.url}');
                                    background-size: ${bgSizeX}% ${bgSizeY}%;
                                    background-position: ${bgPosX}% ${bgPosY}%;">
                        </div>
                      ` : `
                        <div class="slot-empty-placeholder">
                          <span class="slot-number-badge">${idx + 1}</span>
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              `}
            </div>

            <!-- Puzzle Pieces Tray (Unplaced Pieces Shuffled) -->
            ${!allDone ? `
              <div class="puzzle-tray-section">
                <div class="tray-guide-text">
                  <span>👆 Drag or tap piece to place on board!</span>
                </div>

                <div class="puzzle-tray-grid" id="puzzle-tray">
                  ${getShuffledUnplacedPieces(grid, photo).map(piece => `
                    <div class="puzzle-tray-card ${selectedPieceIdx === piece.idx ? 'tray-card-selected' : ''}"
                         data-piece-idx="${piece.idx}"
                         id="tray-piece-${piece.idx}"
                         style="background-image: url('${photo.url}');
                                background-size: ${piece.bgSizeX}% ${piece.bgSizeY}%;
                                background-position: ${piece.bgPosX}% ${piece.bgPosY}%;">
                      <span class="piece-num-tag">${piece.idx + 1}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : `
              <!-- Victory Celebration Box -->
              <div class="puzzle-victory-banner bounce-pop">
                <div class="victory-crown-star">✨ 👑 🎉 ✨</div>
                <h3 class="victory-headline">Wonderful! Puzzle Complete!</h3>
                <p class="victory-subline">+5 Royal Stars ⭐⭐⭐⭐⭐</p>
                <div class="victory-btn-row">
                  <button class="puzzle-action-btn replay-btn" id="btn-replay-puzzle">🔄 Play Again</button>
                  <button class="puzzle-action-btn next-pic-btn" id="btn-victory-next">▶ Next Picture</button>
                </div>
              </div>
            `}

          </div>
        </div>
      `;

      // Event handlers
      setupEvents();
    }

    function getShuffledUnplacedPieces(grid, photo) {
      const list = [];
      for (let idx = 0; idx < grid.count; idx++) {
        if (!placedIndices.has(idx)) {
          const col = idx % grid.cols;
          const row = Math.floor(idx / grid.cols);
          const bgPosX = grid.cols > 1 ? (col / (grid.cols - 1)) * 100 : 0;
          const bgPosY = grid.rows > 1 ? (row / (grid.rows - 1)) * 100 : 0;
          const bgSizeX = grid.cols * 100;
          const bgSizeY = grid.rows * 100;

          list.push({ idx, col, row, bgPosX, bgPosY, bgSizeX, bgSizeY });
        }
      }
      return list;
    }

    function placePiece(targetIdx) {
      if (placedIndices.has(targetIdx)) return;
      placedIndices.add(targetIdx);
      selectedPieceIdx = null;

      window.soundEngine.playSuccess();
      window.createSparkles(container.querySelector(`#slot-${targetIdx}`));

      const grid = getGridConfig();
      if (placedIndices.size === grid.count) {
        // VICTORY!
        isVictory = true;
        render();
        window.soundEngine.playSuccess();
        window.addStar(5);
        window.speechEngine.speak("Superstar! Beautiful puzzle!");
        setTimeout(() => {
          window.createSparkles(container.querySelector('#puzzle-board'));
        }, 150);
      } else {
        render();
      }
    }

    function setupEvents() {
      // Back to map
      container.querySelector('#btn-back-map').onclick = () => {
        window.soundEngine.playPop();
        window.showScreen('map');
      };

      // Mode 4 Frames
      container.querySelector('#btn-mode-4').onclick = () => {
        if (pieceMode !== 4) {
          window.soundEngine.playPop();
          pieceMode = 4;
          initPuzzleState();
          render();
        }
      };

      // Mode 6 Frames
      container.querySelector('#btn-mode-6').onclick = () => {
        if (pieceMode !== 6) {
          window.soundEngine.playPop();
          pieceMode = 6;
          initPuzzleState();
          render();
        }
      };

      // Hint Toggle
      container.querySelector('#btn-toggle-hint').onclick = () => {
        window.soundEngine.playPop();
        showHint = !showHint;
        render();
      };

      // Next Photo
      const nextBtn = container.querySelector('#btn-next-photo');
      if (nextBtn) {
        nextBtn.onclick = () => {
          window.soundEngine.playPop();
          currentPhotoIdx = (currentPhotoIdx + 1) % PUZZLE_PHOTOS.length;
          initPuzzleState();
          render();
        };
      }

      // Ribbon Photo selector
      container.querySelectorAll('.ribbon-photo-item').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          if (idx !== currentPhotoIdx) {
            window.soundEngine.playPop();
            currentPhotoIdx = idx;
            initPuzzleState();
            render();
          }
        };
      });

      // Victory buttons
      const replayBtn = container.querySelector('#btn-replay-puzzle');
      if (replayBtn) {
        replayBtn.onclick = () => {
          window.soundEngine.playPop();
          initPuzzleState();
          render();
        };
      }

      const victoryNextBtn = container.querySelector('#btn-victory-next');
      if (victoryNextBtn) {
        victoryNextBtn.onclick = () => {
          window.soundEngine.playPop();
          currentPhotoIdx = (currentPhotoIdx + 1) % PUZZLE_PHOTOS.length;
          initPuzzleState();
          render();
        };
      }

      // Drag & Drop and Tap interactions on Tray Cards
      initDragAndDropAndTap();

      // Ensure active ribbon photo is visible in ribbon viewport
      setTimeout(() => {
        const activeThumb = container.querySelector('.ribbon-photo-item.active-ribbon-photo');
        if (activeThumb && activeThumb.scrollIntoView) {
          activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 50);
    }

    function initDragAndDropAndTap() {
      const trayCards = container.querySelectorAll('.puzzle-tray-card');
      const slots = container.querySelectorAll('.puzzle-slot-box');

      trayCards.forEach(card => {
        const pieceIdx = parseInt(card.dataset.pieceIdx, 10);
        let isDragging = false;
        let startX = 0, startY = 0;
        let moved = false;

        function onStart(clientX, clientY) {
          isDragging = true;
          moved = false;
          startX = clientX;
          startY = clientY;
          card.classList.add('is-dragging-piece');
          window.soundEngine.playPop();
        }

        function onMove(clientX, clientY) {
          if (!isDragging) return;
          const dx = clientX - startX;
          const dy = clientY - startY;
          if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
            moved = true;
          }
          card.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
          card.style.zIndex = '999';

          // Highlight target slot if hovering over it
          slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
              slot.classList.add('slot-hover-target');
            } else {
              slot.classList.remove('slot-hover-target');
            }
          });
        }

        function onEnd(clientX, clientY) {
          if (!isDragging) return;
          isDragging = false;
          card.classList.remove('is-dragging-piece');
          card.style.transform = '';
          card.style.zIndex = '';

          slots.forEach(s => s.classList.remove('slot-hover-target'));

          if (moved) {
            // Find which slot it was dropped onto
            let droppedSlotIdx = null;
            slots.forEach(slot => {
              const rect = slot.getBoundingClientRect();
              if (clientX >= rect.left && clientX <= rect.right &&
                  clientY >= rect.top && clientY <= rect.bottom) {
                droppedSlotIdx = parseInt(slot.dataset.slotIdx, 10);
              }
            });

            if (droppedSlotIdx !== null) {
              // If dropped on the correct slot OR if toddler dropped on any valid slot
              if (droppedSlotIdx === pieceIdx) {
                placePiece(pieceIdx);
                return;
              } else {
                // Wrong slot feedback
                window.soundEngine.playBuzzer();
                const targetSlot = container.querySelector(`#slot-${droppedSlotIdx}`);
                if (targetSlot) {
                  targetSlot.classList.add('slot-wrong-flash');
                  setTimeout(() => targetSlot.classList.remove('slot-wrong-flash'), 500);
                }
              }
            }
          } else {
            // Tap interaction:
            // If toddler taps the piece, snap directly to its matching slot!
            placePiece(pieceIdx);
          }
        }

        card.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          onStart(e.clientX, e.clientY);

          const moveHandler = (ev) => onMove(ev.clientX, ev.clientY);
          const upHandler = (ev) => {
            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', upHandler);
            onEnd(ev.clientX, ev.clientY);
          };

          window.addEventListener('pointermove', moveHandler);
          window.addEventListener('pointerup', upHandler);
        });
      });

      // Also allow tapping on empty slots if a tray piece is selected
      slots.forEach(slot => {
        slot.onclick = () => {
          const slotIdx = parseInt(slot.dataset.slotIdx, 10);
          if (selectedPieceIdx !== null && selectedPieceIdx === slotIdx) {
            placePiece(slotIdx);
          }
        };
      });
    }

    initPuzzleState();
    render();
  };
})();
