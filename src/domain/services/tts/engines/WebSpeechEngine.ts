import type { ITtsEngine, TtsOptions } from '@/types';
import { VOICE_LOAD_TIMEOUT_MS } from '@/types/constants';
import { hasWebSpeechSupport } from '@/utils/common';
import { isNull, hasElements } from '@/utils/guards';

const DEFAULT_LOCALE = 'en-US';

/**
 * Web Speech API TTS engine implementation
 */
export class WebSpeechEngine implements ITtsEngine {
  private readonly synth: SpeechSynthesis | null = null;

  constructor() {
    if (hasWebSpeechSupport()) {
      this.synth = globalThis.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return !isNull(this.synth);
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.synth) {
      return [];
    }

    return this.waitForVoices(this.synth);
  }

  private waitForVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = synth.getVoices();

      if (this.hasVoices(voices)) {
        resolve(voices);
        return;
      }

      const timeout = this.createVoiceTimeout(resolve);
      this.addVoiceChangeListener(synth, resolve, timeout);
    });
  }

  private hasVoices(voices: SpeechSynthesisVoice[]): boolean {
    return hasElements(voices);
  }

  private createVoiceTimeout(
    resolve: (voices: SpeechSynthesisVoice[]) => void
  ): ReturnType<typeof setTimeout> {
    return setTimeout(() => resolve([]), VOICE_LOAD_TIMEOUT_MS);
  }

  private addVoiceChangeListener(
    synth: SpeechSynthesis,
    resolve: (voices: SpeechSynthesisVoice[]) => void,
    timeout: ReturnType<typeof setTimeout>
  ): void {
    synth.addEventListener('voiceschanged', () => {
      clearTimeout(timeout);
      resolve(synth.getVoices());
    });
  }

  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.synth) {
      throw new Error('Speech synthesis not supported');
    }

    this.cancel();
    return this.createUtterancePromise(this.synth, text, options);
  }

  private createUtterancePromise(
    synth: SpeechSynthesis,
    text: string,
    options: TtsOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = this.createUtterance(text, options);
      this.setUtteranceHandlers(utterance, resolve, reject);
      synth.speak(utterance);
    });
  }

  private createUtterance(text: string, options: TtsOptions): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || DEFAULT_LOCALE;
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
