// Parental Gate & Eye Rest Timer (Apple Kids Category Compliant)
(function() {
  let playTimeSeconds = 0;
  let sessionLimitMinutes = parseInt(localStorage.getItem('elsa_play_limit') || '15', 10);
  let timerInterval = null;

  // Eye rest timer tracking
  function startSessionTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      playTimeSeconds++;
      if (sessionLimitMinutes > 0 && playTimeSeconds >= sessionLimitMinutes * 60) {
        showEyeRestScreen();
      }
    }, 1000);
  }

  function showEyeRestScreen() {
    const isVi = window.speechEngine.getLanguage().startsWith('vi');
    const overlay = document.createElement('div');
    overlay.id = 'eye-rest-overlay';
    overlay.className = 'eye-rest-screen';
    overlay.innerHTML = `
      <div class="eye-rest-content">
        <div class="moon-icon">🌙✨</div>
        <h2>${isVi ? 'Đến giờ nghỉ mắt rồi bé yêu!' : 'Time for an Eye Break!'}</h2>
        <p>${isVi ? 'Hôm nay bé đã chơi rất ngoan và học được nhiều điều hay. Mình hãy nhắm mắt nghỉ ngơi một chút nhé!' : 'You played so well today! Let us close our eyes and take a little rest!'}</p>
        <button class="resume-parent-btn" id="btn-parent-resume">🔒 ${isVi ? 'Phụ Huynh Cho Phép Tiếp Tục' : 'Parent Resume'}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    window.speechEngine.speak(isVi ? "Bé đã chơi rất ngoan! Bây giờ mình cùng nhắm mắt nghỉ ngơi một chút nhé!" : "Good job sweetie! Time to rest your eyes!");

    overlay.querySelector('#btn-parent-resume').onclick = () => {
      window.openParentalGate(() => {
        overlay.remove();
        playTimeSeconds = 0; // reset
      });
    };
  }

  // Parental Gate Modal (Apple Kids requirement: Math problem gate)
  window.openParentalGate = function(onSuccessCallback) {
    const num1 = Math.floor(Math.random() * 5) + 2;
    const num2 = Math.floor(Math.random() * 4) + 1;
    const correctAnswer = num1 + num2;

    const wrong1 = correctAnswer + 1;
    const wrong2 = Math.max(1, correctAnswer - 2);
    const answers = [correctAnswer, wrong1, wrong2].sort(() => 0.5 - Math.random());

    const modal = document.createElement('div');
    modal.className = 'parental-modal';
    modal.innerHTML = `
      <div class="parental-box">
        <div class="parental-lock-icon">🔒</div>
        <h3>Khu Vực Dành Cho Phụ Huynh</h3>
        <p class="parental-instruction">Apple yêu cầu xác nhận bạn là người lớn. Hãy chọn kết quả đúng:</p>
        <div class="math-question">${num1} + ${num2} = ?</div>

        <div class="math-options">
          ${answers.map(ans => `
            <button class="math-opt-btn" data-val="${ans}">${ans}</button>
          `).join('')}
        </div>

        <button class="close-gate-btn" id="btn-close-gate">✕ Đóng</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-close-gate').onclick = () => {
      window.soundEngine.playPop();
      modal.remove();
    };

    modal.querySelectorAll('.math-opt-btn').forEach(btn => {
      btn.onclick = () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === correctAnswer) {
          window.soundEngine.playSuccess();
          modal.remove();
          if (onSuccessCallback) onSuccessCallback();
        } else {
          window.soundEngine.playGentleTryAgain();
          btn.classList.add('shake-card');
          setTimeout(() => btn.classList.remove('shake-card'), 500);
        }
      };
    });
  };

  // Parental Dashboard View
  window.renderParentDashboard = function(container) {
    const isVi = window.speechEngine.getLanguage().startsWith('vi');

    container.innerHTML = `
      <div class="zone-screen parent-zone">
        <div class="zone-header">
          <button class="back-btn" id="btn-back-map">🗺️ Bản Đồ</button>
          <h2 class="zone-title">🔒 Góc Phụ Huynh</h2>
          <div class="star-badge">⭐ ${window.getStars()}</div>
        </div>

        <div class="parent-card-box">
          <h3>⏱️ Giới Hạn Thời Gian Chơi Mỗi Lần</h3>
          <p class="setting-desc">Tự động nhắc bé nghỉ mắt để bảo vệ thị lực:</p>
          <div class="time-limit-options">
            <button class="time-btn ${sessionLimitMinutes === 10 ? 'active' : ''}" data-mins="10">10 Phút</button>
            <button class="time-btn ${sessionLimitMinutes === 15 ? 'active' : ''}" data-mins="15">15 Phút</button>
            <button class="time-btn ${sessionLimitMinutes === 20 ? 'active' : ''}" data-mins="20">20 Phút</button>
            <button class="time-btn ${sessionLimitMinutes === 0 ? 'active' : ''}" data-mins="0">Không giới hạn</button>
          </div>
        </div>

        <div class="parent-card-box">
          <h3>🗣️ Ngôn Ngữ Giọng Đọc Của Elsa</h3>
          <div class="lang-switch-row">
            <button class="lang-btn ${isVi ? 'active' : ''}" id="btn-lang-vi">🇻🇳 Tiếng Việt</button>
            <button class="lang-btn ${!isVi ? 'active' : ''}" id="btn-lang-en">🇬🇧 English</button>
          </div>
        </div>

        <div class="parent-card-box parenting-tips">
          <h3>💡 Gợi Ý Hoạt Động Cùng Bé Ở Nhà</h3>
          <ul class="tips-list">
            <li>🍎 <strong>Hôm nay bé học màu đỏ:</strong> Bố mẹ hãy cùng bé tìm 3 đồ vật màu đỏ trong phòng khách nhé!</li>
            <li>🐟 <strong>Học đếm 1-10:</strong> Hãy cho bé tự xếp 5 chiếc thìa ăn cơm để luyện đếm thực tế.</li>
            <li>🪥 <strong>Thói quen tốt:</strong> Cùng bé hát bài hát đánh răng 2 phút mỗi buổi sáng và tối.</li>
          </ul>
        </div>
      </div>
    `;

    container.querySelector('#btn-back-map').onclick = () => {
      window.soundEngine.playPop();
      window.showScreen('map');
    };

    container.querySelectorAll('.time-btn').forEach(btn => {
      btn.onclick = () => {
        window.soundEngine.playPop();
        sessionLimitMinutes = parseInt(btn.dataset.mins, 10);
        localStorage.setItem('elsa_play_limit', sessionLimitMinutes.toString());
        container.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });

    container.querySelector('#btn-lang-vi').onclick = () => {
      window.soundEngine.playMagic();
      window.speechEngine.setLanguage('vi-VN');
      window.renderParentDashboard(container);
      window.speechEngine.speak("Chào bố mẹ! Elsa sẽ nói tiếng Việt cùng bé!");
    };

    container.querySelector('#btn-lang-en').onclick = () => {
      window.soundEngine.playMagic();
      window.speechEngine.setLanguage('en-US');
      window.renderParentDashboard(container);
      window.speechEngine.speak("Hello parents! Elsa will speak English with your child!");
    };
  };

  document.addEventListener('DOMContentLoaded', () => {
    startSessionTimer();
  });
})();

