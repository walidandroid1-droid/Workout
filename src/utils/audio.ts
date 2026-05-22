// Web Audio and Speech Synthesis utilities for iPhone safari compatibility
let audioCtx: AudioContext | null = null;
let isVoiceEnabled = true;

export function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (required by Safari/Chrome security)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function setVoiceEnabled(enabled: boolean) {
  isVoiceEnabled = enabled;
}

export function getVoiceEnabled() {
  return isVoiceEnabled;
}

export function playBeep(frequency = 440, duration = 0.1, type: OscillatorType = 'sine') {
  try {
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    // Smooth release to avoid pop/clicks
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Failed to play synthesized audio beep:", e);
  }
}

export function playTactileClick() {
  playBeep(600, 0.05, 'triangle');
}

export function playCountDownBeep() {
  playBeep(400, 0.15, 'sine');
}

export function playStartBeep() {
  playBeep(880, 0.4, 'sine');
}

export function playCompletionFanfare() {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(freq, 0.25, 'triangle');
    }, index * 180);
  });
}

// Speak utilizing French localized voice synth
export function speak(text: string) {
  if (!isVoiceEnabled) return;
  try {
    if ('speechSynthesis' in window) {
      // Cancel previous speech to avoid overlapping
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      
      // Attempt to assign a high-quality French voice
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(v => v.lang.startsWith('fr'));
      if (frVoice) {
        utterance.voice = frVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    console.warn("Speech Synthesis failed:", e);
  }
}
