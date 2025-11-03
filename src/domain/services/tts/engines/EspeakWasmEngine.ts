import type { ITtsEngine, TtsOptions } from '@/types';

/**
 * Espeak-ng WASM TTS engine implementation
 * Uses WebAssembly version of espeak-ng for offline text-to-speech
 */
export class EspeakWasmEngine implements ITtsEngine {
  private espeakModule: unknown = null;
  private currentUtterance: AbortController | null = null;
  private readonly audioContext: AudioContext | null = null;

  constructor() {
    if (this.isAudioContextSupported()) {
      this.audioContext = new AudioContext();
    }
  }

  private isAudioContextSupported(): boolean {
    return typeof window !== 'undefined' && 'AudioContext' in window;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'WebAssembly' in window && this.audioContext !== null;
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    // Espeak-ng WASM doesn't use SpeechSynthesisVoice
    // Return empty array as it has its own voice system
    return [];
  }

  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Espeak WASM is not supported in this environment');
    }

    this.cancel();
    this.currentUtterance = new AbortController();

    try {
      await this.loadEspeakModule();
      await this.synthesizeSpeech(text, options, this.currentUtterance.signal);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        throw new Error(`Espeak WASM synthesis failed: ${error.message}`);
      }
    }
  }

  private async loadEspeakModule(): Promise<void> {
    if (this.espeakModule) {
      return;
    }

    // Placeholder for actual espeak-ng-wasm module loading
    // In a real implementation, this would dynamically import the WASM module
    // For now, we throw to indicate the module needs to be added
    throw new Error(
      'Espeak-ng WASM module not loaded. Install espeak-ng-wasm package to enable this engine.'
    );
  }

  private async synthesizeSpeech(
    text: string,
    options: TtsOptions,
    signal: AbortSignal
  ): Promise<void> {
    if (signal.aborted) {
      throw new Error('Speech synthesis was cancelled');
    }

    // Validate text input
    if (!text || text.trim().length === 0) {
      return;
    }

    const rate = this.normalizeRate(options.rate);
    const pitch = this.normalizePitch(options.pitch);
    const volume = this.normalizeVolume(options.volume);

    // In a real implementation, this would:
    // 1. Use espeak-ng WASM to generate audio samples
    // 2. Create an AudioBuffer from the samples
    // 3. Play the audio through the AudioContext
    // 4. Respect the abort signal for cancellation

    return this.playAudio(text, rate, pitch, volume, signal);
  }

  private normalizeRate(rate?: number): number {
    return Math.max(0.1, Math.min(10, rate || 1));
  }

  private normalizePitch(pitch?: number): number {
    return Math.max(0, Math.min(100, pitch || 50));
  }

  private normalizeVolume(volume?: number): number {
    return Math.max(0, Math.min(1, volume || 1));
  }

  private async playAudio(
    _text: string,
    _rate: number,
    _pitch: number,
    _volume: number,
    signal: AbortSignal
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new Error('Playback cancelled'));
        return;
      }

      // In a real implementation, this would play the synthesized audio
      // For now, we simulate completion
      const timeoutId = setTimeout(() => {
        resolve();
      }, 100);

      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Playback cancelled'));
      });
    });
  }

  cancel(): void {
    if (this.currentUtterance) {
      this.currentUtterance.abort();
      this.currentUtterance = null;
    }

    if (this.audioContext) {
      // Stop any playing audio sources
      this.audioContext.suspend();
      this.audioContext.resume();
    }
  }
}
