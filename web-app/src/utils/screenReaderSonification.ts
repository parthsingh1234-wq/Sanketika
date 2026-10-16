/**
 * screenReaderSonification.ts
 * Web Audio API Acoustic Sonification, Tactile Haptics & ARIA Live Engine
 * Designed for Blind, Low-Vision, and Deafblind users to provide real-time
 * non-visual sensory feedback during gesture recognition, mode changes, and emergency triggers.
 */

export type EarconType =
  | 'sign_commit'
  | 'delete'
  | 'clear'
  | 'mode_switch'
  | 'emergency_sos'
  | 'scan_tick'
  | 'announce';

class AudioSonificationEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private hapticsEnabled = true;
  private masterVolume = 0.6;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem('sanketika_sound_enabled');
        if (savedSound !== null) this.soundEnabled = savedSound === 'true';
        const savedHaptics = localStorage.getItem('sanketika_haptics_enabled');
        if (savedHaptics !== null) this.hapticsEnabled = savedHaptics === 'true';
      } catch (e) {
        // Ignore localStorage error
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('sanketika_sound_enabled', String(enabled));
    } catch {}
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
    try {
      localStorage.setItem('sanketika_haptics_enabled', String(enabled));
    } catch {}
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Synthesize earcon tones dynamically via Web Audio API.
   * Completely offline, 0ms latency, zero assets required.
   */
  public playEarcon(type: EarconType) {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.masterVolume, now);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'sign_commit': {
        // Melodic ascending two-tone chime: C5 (523.25Hz) -> E5 (659.25Hz)
        const osc1 = ctx.createOscillator();
        const oscGain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        oscGain1.gain.setValueAtTime(0.35 * this.masterVolume, now);
        oscGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(oscGain1);
        oscGain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        const osc2 = ctx.createOscillator();
        const oscGain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.08);
        oscGain2.gain.setValueAtTime(0.4 * this.masterVolume, now + 0.08);
        oscGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc2.connect(oscGain2);
        oscGain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
        break;
      }

      case 'delete': {
        // Low resonant downward thud (240Hz -> 180Hz)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
        oscGain.gain.setValueAtTime(0.4 * this.masterVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'clear': {
        // Sweeping low tone to indicate canvas clear
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        oscGain.gain.setValueAtTime(0.25 * this.masterVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'mode_switch': {
        // Triple rising chime (A4: 440, C#5: 554.37, E5: 659.25)
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          const startTime = now + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          oscGain.gain.setValueAtTime(0.3 * this.masterVolume, startTime);
          oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.15);
        });
        break;
      }

      case 'emergency_sos': {
        // Strobe emergency two-tone siren
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          const t = now + i * 0.18;
          osc.type = 'square';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, t);
          oscGain.gain.setValueAtTime(0.4 * this.masterVolume, t);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.16);
        }
        break;
      }

      case 'scan_tick': {
        // Subtle soft click for switch accessibility scanning
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        oscGain.gain.setValueAtTime(0.15 * this.masterVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }

      case 'announce': {
        // High notification ping (784Hz)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, now);
        oscGain.gain.setValueAtTime(0.25 * this.masterVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
    }
  }

  /**
   * Tactile haptic feedback pattern via navigator.vibrate
   */
  public triggerHaptic(type: EarconType) {
    if (!this.hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;

    try {
      switch (type) {
        case 'sign_commit':
          navigator.vibrate(50); // short crisp tap
          break;
        case 'delete':
          navigator.vibrate([40, 30, 40]); // double tap
          break;
        case 'clear':
          navigator.vibrate(120); // solid pulse
          break;
        case 'mode_switch':
          navigator.vibrate([30, 20, 30, 20, 50]); // ascending buzz
          break;
        case 'emergency_sos':
          // Morse code SOS: ... --- ...
          navigator.vibrate([80, 40, 80, 40, 80, 100, 240, 40, 240, 40, 240, 100, 80, 40, 80, 40, 80]);
          break;
        case 'scan_tick':
          navigator.vibrate(15); // gentle tick
          break;
      }
    } catch {
      // Haptics permission or device unsupported
    }
  }

  /**
   * Unified trigger for multimodal sensory feedback (Audio + Haptic)
   */
  public triggerSensoryFeedback(type: EarconType) {
    this.playEarcon(type);
    this.triggerHaptic(type);
  }
}

export const sonificationEngine = new AudioSonificationEngine();

export interface ScreenReaderAnnouncement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
}

/**
 * Screen Reader ARIA Live Manager
 */
class ScreenReaderManager {
  private listeners: ((announcement: ScreenReaderAnnouncement) => void)[] = [];
  private history: ScreenReaderAnnouncement[] = [];

  public announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!message) return;
    const announcement: ScreenReaderAnnouncement = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      message,
      priority,
      timestamp: Date.now(),
    };

    this.history.unshift(announcement);
    if (this.history.length > 25) this.history.pop();

    this.listeners.forEach(fn => fn(announcement));
  }

  public subscribe(fn: (announcement: ScreenReaderAnnouncement) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public getHistory(): ScreenReaderAnnouncement[] {
    return [...this.history];
  }
}

export const screenReader = new ScreenReaderManager();
