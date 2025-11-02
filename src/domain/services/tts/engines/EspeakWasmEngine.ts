import type { ITtsEngine } from '@/types';

/**
 * Espeak WASM TTS engine implementation (stub for future implementation)
 */
export class EspeakWasmEngine implements ITtsEngine {
  isSupported(): boolean {
    return false; // Not yet implemented
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return [];
  }

  async speak(): Promise<void> {
    throw new Error('Espeak WASM engine not yet implemented');
  }

  cancel(): void {
    // No-op for stub
  }
}
