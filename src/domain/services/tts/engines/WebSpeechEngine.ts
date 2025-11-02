import type { ITtsEngine, TtsOptions } from '@/types';
import { VOICE_LOAD_TIMEOUT_MS } from '@/types/constants';

/**
 * Web Speech API TTS engine implementation
 */
export class WebSpeechEngine implements ITtsEngine {
  private readonly synth: SpeechSynthesis | null = null;

  constructor() {
    if (this.isBrowserSupported()) {
      this.synth = window.speechSynthesis;
    }
  }

  private isBrowserSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.synth) {
      return [];
    }

    return this.waitForVoices();
  }

  private waitForVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = this.synth!.getVoices();

      if (this.hasVoices(voices)) {
        resolve(voices);
        return;
      }

      const timeout = this.createVoiceTimeout(resolve);
      this.addVoiceChangeListener(resolve, timeout);
    });
  }

  private hasVoices(voices: SpeechSynthesisVoice[]): boolean {
    return voices.length > 0;
  }

  private createVoiceTimeout(
    resolve: (voices: SpeechSynthesisVoice[]) => void
  ): ReturnType<typeof setTimeout> {
    return setTimeout(() => resolve([]), VOICE_LOAD_TIMEOUT_MS);
  }

  private addVoiceChangeListener(
    resolve: (voices: SpeechSynthesisVoice[]) => void,
    timeout: ReturnType<typeof setTimeout>
  ): void {
    this.synth!.addEventListener('voiceschanged', () => {
      clearTimeout(timeout);
      resolve(this.synth!.getVoices());
    });
  }

  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.synth) {
      throw new Error('Speech synthesis not supported');
    }

    this.cancel();
    return this.createUtterancePromise(text, options);
  }

  private createUtterancePromise(text: string, options: TtsOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = this.createUtterance(text, options);
      this.setUtteranceHandlers(utterance, resolve, reject);
      this.synth!.speak(utterance);
    });
  }

  private createUtterance(text: string, options: TtsOptions): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    return utterance;
  }

  private setUtteranceHandlers(
    utterance: SpeechSynthesisUtterance,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
  }

  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
