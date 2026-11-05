// Elsa Coloring Studio (27 Official Frozen Coloring Sheets for iPad & iPhone)
(function() {
  const COLORING_PAGES = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: `Elsa Coloring Page ${i + 1}`,
    url: `coloring/elsa_coloring_${i + 1}.jpg`
  }));

  const PALETTE = [
    { name: 'Ice Cyan', hex: '#38bdf8' },
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Elsa Pink', hex: '#f472b6' },
    { name: 'Magic Purple', hex: '#a855f7' },
    { name: 'Sun Yellow', hex: '#facc15' },
    { name: 'Sunset Orange', hex: '#fb923c' },
    { name: 'Apple Red', hex: '#ef4444' },
    { name: 'Forest Green', hex: '#22c55e' },
    { name: 'Snow White', hex: '#ffffff' },
    { name: 'Midnight', hex: '#1e293b' }
  ];

  window.initColoringZone = function(container) {
    let currentIdx = 0;
    let currentColor = PALETTE[0].hex;
    let currentSize = 22;

    function render() {
      const page = COLORING_PAGES[currentIdx];

      container.innerHTML = `
        <div class="zone-screen coloring-screen-wrap">
          <div class="zone-header">
            <button class="back-btn" id="btn-back-map">🗺️ Map</button>
            <h2 class="zone-title">🎨 Elsa Coloring Studio</h2>
            <div class="star-badge" id="coloring-stars">⭐ ${window.getStars()}</div>
          </div>

          <!-- Stage Container -->
          <div class="coloring-stage-container">
            
            <!-- Navigation Header -->
            <div class="coloring-top-nav">
              <button class="arrow-nav-btn" id="btn-prev-page">◀</button>
              <div class="page-title-pill">
                <span>Page ${currentIdx + 1} / ${COLORING_PAGES.length}</span>
              </div>
              <button class="arrow-nav-btn" id="btn-next-page">▶</button>
            </div>

            <!-- Canvas Workstation -->
            <div class="coloring-canvas-wrapper" id="canvas-card">
              <div class="coloring-paper" id="coloring-paper">
                <img src="${page.url}" alt="${page.title}" class="coloring-outline-img" id="outline-img" crossorigin="anonymous" />
                <canvas id="paint-canvas"></canvas>
              </div>
            </div>

            <!-- Palette & Size Tools -->
            <div class="coloring-toolbar">
              <!-- Colors -->
              <div class="palette-row">
                ${PALETTE.map(c => `
                  <button class="color-swatch-btn ${c.hex === currentColor ? 'active-color' : ''}" 
                          data-color="${c.hex}" 
                          style="background: ${c.hex};" 
                          title="${c.name}"></button>
                `).join('')}
              </div>

              <!-- Sizes & Actions -->
              <div class="tools-action-row">
                <div class="brush-sizes-group">
                  <button class="brush-size-btn ${currentSize === 12 ? 'active-size' : ''}" data-size="12">✏️ Small</button>
                  <button class="brush-size-btn ${currentSize === 22 ? 'active-size' : ''}" data-size="22">🖌️ Medium</button>
                  <button class="brush-size-btn ${currentSize === 36 ? 'active-size' : ''}" data-size="36">🖍️ Big</button>
                </div>

                <div class="action-buttons-group">
                  <button class="letter-tool-btn tool-clear" id="btn-clear-paint">🧹 Clear</button>
                  <button class="letter-tool-btn tool-sparkle" id="btn-done-paint">✨ Done (+2⭐)</button>
                </div>
              </div>
            </div>

            <!-- Quick Thumbnails Carousel -->
            <div class="coloring-thumbs-bar">
              ${COLORING_PAGES.map((p, idx) => `
                <button class="thumb-sheet-btn ${idx === currentIdx ? 'active-thumb' : ''}" data-idx="${idx}">
                  <img src="${p.url}" alt="Tranh ${idx+1}" />
                </button>
              `).join('')}
            </div>

          </div>
        </div>
      `;

      // Event handlers
      container.querySelector('#btn-back-map').onclick = () => {
        window.soundEngine.playPop();
        window.showScreen('map');
      };

      container.querySelector('#btn-prev-page').onclick = () => {
        window.soundEngine.playPop();
        currentIdx = (currentIdx - 1 + COLORING_PAGES.length) % COLORING_PAGES.length;
        render();
      };

      container.querySelector('#btn-next-page').onclick = () => {
        window.soundEngine.playPop();
        currentIdx = (currentIdx + 1) % COLORING_PAGES.length;
        render();
      };

      // Color selection
      container.querySelectorAll('.color-swatch-btn').forEach(btn => {
        btn.onclick = () => {
          window.soundEngine.playPop();
          currentColor = btn.dataset.color;
          container.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active-color'));
          btn.classList.add('active-color');
        };
      });

      // Brush size
      container.querySelectorAll('.brush-size-btn').forEach(btn => {
        btn.onclick = () => {
          window.soundEngine.playPop();
          currentSize = parseInt(btn.dataset.size, 10);
          container.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active-size'));
          btn.classList.add('active-size');
        };
      });

      // Clear
      container.querySelector('#btn-clear-paint').onclick = () => {
        window.soundEngine.playPop();
        clearCanvas();
      };

      // Finish / Good
      container.querySelector('#btn-done-paint').onclick = () => {
        window.soundEngine.playSuccess();
        window.createSparkles(container.querySelector('#coloring-paper'));
        window.addStar(2);
        const starsEl = container.querySelector('#coloring-stars');
        if (starsEl) starsEl.innerText = `⭐ ${window.getStars()}`;
        window.speechEngine.speak("Beautiful coloring! So pretty!");
      };

      // Thumbnails
      container.querySelectorAll('.thumb-sheet-btn').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.idx, 10);
          if (idx !== currentIdx) {
            window.soundEngine.playPop();
            currentIdx = idx;
            render();
          }
        };
      });

      // Scroll active thumbnail into view
      const activeThumb = container.querySelector('.active-thumb');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      setupCanvas();
    }

    function clearCanvas() {
      const canvas = container.querySelector('#paint-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function setupCanvas() {
      const img = container.querySelector('#outline-img');
      const canvas = container.querySelector('#paint-canvas');
      if (!img || !canvas) return;

      const initSize = () => {
        const rect = img.getBoundingClientRect();
        canvas.width = rect.width || 360;
        canvas.height = rect.height || 480;
      };

      if (img.complete) {
        initSize();
      } else {
        img.onload = initSize;
      }

      const ctx = canvas.getContext('2d');
      let isPainting = false;

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
        isPainting = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = 'multiply'; // Keeps black outlines crisp!
        ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
        ctx.stroke();
      }

      function move(e) {
        if (!isPainting) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      function stop(e) {
        if (isPainting) {
          isPainting = false;
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
    window.speechEngine.speak("Let's color Elsa!");
  };
})();

