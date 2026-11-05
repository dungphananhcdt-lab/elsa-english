// Elsa Sweet Female English Speech Engine (Short, punchy phrases for Toddlers 3-5)
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentLang = 'en-US'; // ALWAYS DEFAULT ENGLISH
    this.voice = null;
    this.rate = 0.85;   // Gentle, clear pace
    this.pitch = 1.25;  // Sweet, friendly Elsa princess pitch
    this.initVoices();
  }

  getLanguage() {
    return 'en-US';
  }

  initVoices() {
    if (!this.synth) return;

    const findVoice = () => {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;

      // Select high-quality sweet English female voice (Siri, Samantha, Victoria, Karen, Zira)
      this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Siri') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Female')))
                || voices.find(v => v.lang.startsWith('en'));
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  speak(text, onEnd) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      if (this.synth.speaking || this.synth.pending) {
        this.synth.cancel();
      }
      this.synth.resume();
    } catch(e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance; // Prevent iOS WebKit Garbage Collection bug

    if (!this.voice) {
      this.initVoices();
    }
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onend = () => {
      this.activeUtterance = null;
      if (window.soundEngine && typeof window.soundEngine.duckBackgroundMusic === 'function') {
        window.soundEngine.duckBackgroundMusic(false);
      }
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      this.activeUtterance = null;
      if (window.soundEngine && typeof window.soundEngine.duckBackgroundMusic === 'function') {
        window.soundEngine.duckBackgroundMusic(false);
      }
      if (onEnd) onEnd();
    };

    setTimeout(() => {
      try {
        if (window.soundEngine && typeof window.soundEngine.duckBackgroundMusic === 'function') {
          window.soundEngine.duckBackgroundMusic(true);
        }
        this.synth.speak(utterance);
      } catch (err) {
        if (window.soundEngine && typeof window.soundEngine.duckBackgroundMusic === 'function') {
          window.soundEngine.duckBackgroundMusic(false);
        }
        console.warn('Speech error:', err);
      }
    }, 40);
  }

  // ULTRA-SHORT PRAISES (1-3 words)
  praise() {
    const praises = [
      "Great job!",
      "Superstar!",
      "You did it!",
      "Star for you!",
      "Awesome!",
      "Yes!"
    ];
    const phrase = praises[Math.floor(Math.random() * praises.length)];
    this.speak(phrase);
    return phrase;
  }

  // ULTRA-SHORT ENCOURAGEMENT (1-3 words)
  encourage(hint) {
    const phrase = hint || "Oops! Try again!";
    this.speak(phrase);
    return phrase;
  }
}

window.speechEngine = new SpeechEngine();
