import type { TTSOptions, TTSService } from './types';

export class WebSpeechService implements TTSService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.synth) return [];

    return new Promise((resolve) => {
      let voices = this.synth!.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      // Some browsers load voices asynchronously
      const timeout = setTimeout(() => {
        resolve([]);
      }, 100);

      this.synth!.addEventListener('voiceschanged', () => {
        clearTimeout(timeout);
        voices = this.synth!.getVoices();
        resolve(voices);
      });
    });
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.synth) {
      throw new Error('Speech synthesis not supported');
    }

    // Cancel any ongoing speech
    this.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synth!.speak(utterance);
    });
  }

  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
