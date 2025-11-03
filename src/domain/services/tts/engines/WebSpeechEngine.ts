import { LocaleCode, type ITtsEngine, type TtsOptions } from '@/types';
import {
  DEFAULT_SPEECH_PITCH,
  DEFAULT_SPEECH_RATE,
  DEFAULT_SPEECH_VOLUME,
  VOICE_LOAD_TIMEOUT_MS,
} from '@/types/constants';
import { hasWebSpeechSupport } from '@/utils/common';
import { isNull, hasElements } from '@/utils/guards';

/**
 * Web Speech API TTS engine implementation
 */
export class WebSpeechEngine implements ITtsEngine {
  private readonly synth: SpeechSynthesis | null = null;

  /**
   * Constructs a WebSpeechEngine
   */
  constructor() {
    if (hasWebSpeechSupport()) {
      this.synth = globalThis.speechSynthesis;
    }
  }

  /**
   * Checks if Web Speech API is supported in the current environment
   * @returns True if supported, false otherwise
   */
  isSupported(): boolean {
    return !isNull(this.synth);
  }

  /**
   * Retrieves available voices from SpeechSynthesis
   * @returns Promise resolving to an array of SpeechSynthesisVoice
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.synth) {
      return [];
    }

    return this.waitForVoices(this.synth);
  }

  /**
   * Waits for voices to be loaded in SpeechSynthesis
   * @param synth - The SpeechSynthesis instance
   * @returns Promise resolving to an array of SpeechSynthesisVoice
   */
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

  /**
   * Checks if voices array has elements
   * @param voices - Array of SpeechSynthesisVoice
   * @returns True if voices are available, false otherwise
   */
  private hasVoices(voices: SpeechSynthesisVoice[]): boolean {
    return hasElements(voices);
  }

  /**
   * Creates a timeout to resolve voices after a delay
   * @param resolve - Promise resolve function
   * @returns Timeout identifier
   */
  private createVoiceTimeout(
    resolve: (voices: SpeechSynthesisVoice[]) => void
  ): ReturnType<typeof setTimeout> {
    return setTimeout(() => resolve([]), VOICE_LOAD_TIMEOUT_MS);
  }

  /**
   * Adds event listener for 'voiceschanged' event
   * @param synth - The SpeechSynthesis instance
   * @param resolve - Promise resolve function
   * @param timeout - Timeout to clear on event
   */
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

  /**
   * Speaks the given text using Web Speech API
   * @param text - The text to speak
   * @param options - TTS options
   * @throws Error if speech synthesis is not supported
   * @return Promise that resolves when speaking is complete
   */
  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.synth) {
      throw new Error('Speech synthesis not supported');
    }

    this.cancel();
    return this.createUtterancePromise(this.synth, text, options);
  }

  /**
   * Creates a promise that resolves when the utterance is finished
   * @param synth - The SpeechSynthesis instance
   * @param text - The text to speak
   * @param options - TTS options
   * @returns Promise that resolves when speaking is complete
   */
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

  /**
   * Creates a SpeechSynthesisUtterance with given text and options
   * @param text - The text to speak
   * @param options - TTS options
   * @returns Configured SpeechSynthesisUtterance
   */
  private createUtterance(text: string, options: TtsOptions): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || LocaleCode.EN_US;
    utterance.rate = options.rate || DEFAULT_SPEECH_RATE;
    utterance.pitch = options.pitch || DEFAULT_SPEECH_PITCH;
    utterance.volume = options.volume || DEFAULT_SPEECH_VOLUME;
    return utterance;
  }

  /**
   * Sets event handlers for the utterance
   * @param utterance - The SpeechSynthesisUtterance instance
   * @param resolve - Promise resolve function
   * @param reject - Promise reject function
   */
  private setUtteranceHandlers(
    utterance: SpeechSynthesisUtterance,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
  }

  /**
   * Cancels any ongoing speech synthesis
   */
  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
