// Elsa Magic Sound Synthesizer + Let It Go Vocal Audio Player & Gentle Ambient BGM
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmDisabled = false;
    this.bgmVolume = 0.20; // Soft, gentle ambient background music
    this.activeMelodyTimeout = [];
    this.letItGoAudio = null;
    this.abcAudio = null;
    this.initAudioElement();
    this.initOnFirstTouch();
  }

  initAudioElement() {
    this.letItGoAudio = new Audio('Image/let_it_go_song.mp3');
    this.letItGoAudio.preload = 'auto';
    this.letItGoAudio.loop = true;
    this.letItGoAudio.volume = this.bgmVolume;

    this.abcAudio = new Audio('Image/abc_song.mp3');
    this.abcAudio.preload = 'auto';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initOnFirstTouch() {
    const unlock = () => {
      this.init();
      if (this.letItGoAudio) this.letItGoAudio.load();
      if (this.abcAudio) this.abcAudio.load();
      // Auto-start gentle background music on first interaction
      if (!this.isBgmDisabled) {
        this.startBackgroundMusic();
      }
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });
    
    // Also attempt direct autoplay on boot (desktop browsers often permit if previously interacted)
    setTimeout(() => {
      if (!this.isBgmDisabled) {
        this.startBackgroundMusic();
      }
    }, 400);
  }

  // GENTLE BACKGROUND MUSIC (LET IT GO AMBIENT LOOP)
  startBackgroundMusic() {
    if (this.isBgmDisabled) return;
    if (!this.letItGoAudio) this.initAudioElement();
    const audio = this.letItGoAudio;
    audio.volume = this.bgmVolume;
    audio.loop = true;

    if (audio.paused) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          this.updateBgmUi(true);
        }).catch(() => {
          // Will unlock on first user gesture
        });
      }
    } else {
      this.updateBgmUi(true);
    }
  }

  pauseBackgroundMusic() {
    if (this.letItGoAudio && !this.letItGoAudio.paused) {
      this.letItGoAudio.pause();
      this.updateBgmUi(false);
    }
  }

  toggleBackgroundMusic() {
    if (!this.letItGoAudio) this.initAudioElement();
    if (this.letItGoAudio.paused) {
      this.isBgmDisabled = false;
      this.startBackgroundMusic();
      return true;
    } else {
      this.isBgmDisabled = true;
      this.pauseBackgroundMusic();
      return false;
    }
  }

  duckBackgroundMusic(isDucked) {
    if (!this.letItGoAudio || this.letItGoAudio.paused) return;
    this.letItGoAudio.volume = isDucked ? 0.06 : this.bgmVolume;
  }

  updateBgmUi(isPlaying) {
    document.querySelectorAll('.bgm-music-toggle-btn').forEach(btn => {
      if (isPlaying) {
        btn.classList.add('bgm-active');
        btn.innerHTML = '🎵 <span class="bgm-label">Music</span>';
        btn.title = "Click to mute background music";
      } else {
        btn.classList.remove('bgm-active');
        btn.innerHTML = '🔇 <span class="bgm-label">Muted</span>';
        btn.title = "Click to play background music";
      }
    });
  }

  isBgmPlaying() {
    return this.letItGoAudio && !this.letItGoAudio.paused;
  }

  // REAL VOCAL SONG: "LET IT GO" (CHORUS TRACK DIRECT START)
  playLetItGoSong(onStatusChange) {
    if (!this.letItGoAudio) this.initAudioElement();
    this.stopAllMelodies();
    this.stopABCSong();

    const audio = this.letItGoAudio;

    if (audio.paused) {
      audio.currentTime = 0;
      audio.volume = 0.85; // Louder for dedicated listening

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.updateBgmUi(true);
          if (onStatusChange) onStatusChange(true);
        }).catch(err => {
          console.warn('Audio play error:', err);
          if (onStatusChange) onStatusChange(false);
        });
      }

      audio.onended = () => {
        audio.volume = this.bgmVolume;
        if (onStatusChange) onStatusChange(false);
      };
    } else {
      audio.pause();
      this.updateBgmUi(false);
      if (onStatusChange) onStatusChange(false);
    }
  }

  stopLetItGoSong() {
    if (this.letItGoAudio && !this.letItGoAudio.paused) {
      this.letItGoAudio.pause();
      this.letItGoAudio.currentTime = 0;
    }
  }

  isLetItGoPlaying() {
    return this.letItGoAudio && !this.letItGoAudio.paused;
  }

  // GENTLE, SOFT "UH-OH" WRONG SOUND (NOT STARTLING, NO LOUD BUZZER)
  playBuzzer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine'; // Soft, warm sine wave
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.22); // Gentle descending "uh-oh"

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playMagic() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    let t = this.ctx.currentTime;
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const dur = i === notes.length - 1 ? 0.4 : 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur * 0.85;
    });
  }

  playWaterSplash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.16);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playPianoNote(freq = 440) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  playAnimalCall(type) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'cat') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.2);
      osc.frequency.linearRampToValueAtTime(450, now + 0.45);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'dog') {
      [0, 0.18].forEach(offset => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(320, now + offset);
        o.frequency.exponentialRampToValueAtTime(140, now + offset + 0.12);
        g.gain.setValueAtTime(0.35, now + offset);
        g.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + offset);
        o.stop(now + offset + 0.12);
      });
    } else if (type === 'duck') {
      [0, 0.16].forEach(offset => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(400, now + offset);
        o.frequency.linearRampToValueAtTime(320, now + offset + 0.14);
        g.gain.setValueAtTime(0.25, now + offset);
        g.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.14);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + offset);
        o.stop(now + offset + 0.14);
      });
    } else if (type === 'cow') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.6);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'sheep' || type === 'goat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.linearRampToValueAtTime(290, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } else if (type === 'rooster') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(650, now + 0.25);
      osc.frequency.linearRampToValueAtTime(750, now + 0.55);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'frog') {
      [0, 0.2].forEach(offset => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(160, now + offset);
        o.frequency.linearRampToValueAtTime(240, now + offset + 0.12);
        g.gain.setValueAtTime(0.3, now + offset);
        g.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + offset);
        o.stop(now + offset + 0.12);
      });
    } else if (type === 'lion' || type === 'tiger' || type === 'bear') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.6);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'bird') {
      [0, 0.1, 0.22].forEach((offset, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(1200 + idx * 250, now + offset);
        o.frequency.exponentialRampToValueAtTime(2200, now + offset + 0.08);
        g.gain.setValueAtTime(0.2, now + offset);
        g.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.08);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + offset);
        o.stop(now + offset + 0.08);
      });
    } else if (type === 'bee') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.5);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      this.playMagic();
    }
  }

  stopAllMelodies() {
    this.activeMelodyTimeout.forEach(id => clearTimeout(id));
    this.activeMelodyTimeout = [];
  }

  // AUTHENTIC VOCAL ABC ALPHABET SONG (BÀI HÁT ABC CÓ LỜI HÁT THẬT)
  playABCSong(onStatusChange, onLetterCallback) {
    this.stopAllMelodies();
    this.pauseBackgroundMusic();
    if (!this.abcAudio) this.initAudioElement();

    if (this.abcAudio.paused) {
      this.abcAudio.currentTime = 0;
      this.abcAudio.play().then(() => {
        if (onStatusChange) onStatusChange(true);
      }).catch(err => {
        console.log('ABC song play error:', err);
      });

      this.abcAudio.onended = () => {
        if (!this.isBgmDisabled) this.startBackgroundMusic();
        if (onStatusChange) onStatusChange(false);
      };
    } else {
      this.abcAudio.pause();
      if (!this.isBgmDisabled) this.startBackgroundMusic();
      if (onStatusChange) onStatusChange(false);
    }
  }

  stopABCSong() {
    if (this.abcAudio && !this.abcAudio.paused) {
      this.abcAudio.pause();
      this.abcAudio.currentTime = 0;
      if (!this.isBgmDisabled) this.startBackgroundMusic();
    }
  }

  isABCSongPlaying() {
    return this.abcAudio && !this.abcAudio.paused;
  }
}

window.soundEngine = new SoundEngine();
