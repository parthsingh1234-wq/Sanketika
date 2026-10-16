import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

/**
 * TTSManager — uses the Web Speech API on Web, but explicitly uses 
 * Capacitor TextToSpeech on native mobile to bypass auto-play blocking.
 */
export class TTSManager {
  private voice: SpeechSynthesisVoice | null = null;
  private ready = false;

  constructor() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    // Voices may not be loaded immediately — try now, then re-try on event
    this.selectBestVoice();
    window.speechSynthesis.onvoiceschanged = () => this.selectBestVoice();
  }

  private selectBestVoice() {
    const all = window.speechSynthesis?.getVoices() ?? [];
    if (!all.length) return;

    const en = all.filter(v => v.lang.startsWith('en'));

    // Ordered preference list — Chrome/Android WebView → best Google neural voices
    const patterns = [
      /google us english/i,        // Chrome desktop  — best quality
      /en-us-wavenet/i,            // WaveNet neural
      /en-us-neural/i,
      /google uk english female/i,
      /google.*english/i,
      /samantha/i,                  // macOS premium voice
      /karen/i,
      /moira/i,
      /en-us/i,
      /en-gb/i,
    ];

    for (const pat of patterns) {
      const match = en.find(v => pat.test(v.name));
      if (match) { this.voice = match; break; }
    }

    if (!this.voice) this.voice = en[0] ?? all[0] ?? null;
    this.ready = true;
    console.log('[TTS] Voice selected:', this.voice?.name, this.voice?.lang);
  }

  public async speak(text: string, voicePref: 'female' | 'male' = 'female', targetLang = 'en'): Promise<void> {
    if (!text) return;

    const REGIONAL_LOCALE_MAP: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      kn: 'kn-IN',
      gu: 'gu-IN',
      ml: 'ml-IN',
      pa: 'pa-IN',
      es: 'es-ES',
      fr: 'fr-FR',
    };

    const langCode = REGIONAL_LOCALE_MAP[targetLang] || 'en-US';

    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.speak({ text, lang: langCode, rate: 0.88, pitch: voicePref === 'female' ? 1.2 : 0.85, volume: 1.0 });
        return;
      } catch (e) {
        console.log('[TTS] Capacitor TTS failed, falling back to Web Speech', e);
      }
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        await this.webSpeak(text, voicePref, targetLang, langCode);
        return;
      } catch (e) {
        console.log('[TTS] Web Speech failed', e);
      }
    }
  }

  private webSpeak(text: string, voicePref: 'female' | 'male', targetLang: string, langCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      synth.cancel(); 

      const utter      = new SpeechSynthesisUtterance(text);
      utter.lang       = langCode;
      utter.rate       = 0.90;  
      utter.pitch      = voicePref === 'female' ? 1.2 : 0.85;   
      utter.volume     = 1.0;

      const voices = synth.getVoices();
      let targetNames: string[] = [];
      
      if (targetLang === 'es') {
        targetNames = voicePref === 'female' ? ['helena', 'laura', 'monica', 'female'] : ['pablo', 'jorge', 'male'];
      } else {
        targetNames = voicePref === 'female' ? ['veena', 'samantha', 'victoria', 'karen', 'moira', 'zira', 'google us english', 'female'] : ['rishi', 'daniel', 'david', 'mark', 'arthur', 'male'];
      }

      let best = voices.find(v => v.lang.startsWith(langCode.split('-')[0]) && targetNames.some(n => v.name.toLowerCase().includes(n)));
      if (!best) best = voices.find(v => v.lang.startsWith(langCode));
      if (!best) best = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));

      if (best) {
        utter.voice = best;
        utter.onend = () => resolve();
        utter.onerror = e => {
          if (e.error === 'interrupted') resolve(); else reject(e);
        };
        synth.speak(utter);
      } else {
        const audio = new Audio(`https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${langCode.split('-')[0]}&q=${encodeURIComponent(text)}`);
        audio.onended = () => resolve();
        audio.onerror = (e) => {
          console.error('TTS Fallback failed', e);
          synth.speak(utter); // last resort
        };
        audio.play().catch(e => {
          console.error('TTS Fallback play failed', e);
          synth.speak(utter);
        });
      }
    });
  }

  public stop() {
    try { window.speechSynthesis?.cancel(); } catch { /* */ }
  }
}
