import type { ITtsEngine } from '@/types';

/**
 * OpenTTS HTTP API engine implementation (stub for future implementation)
 */
export class OpenTtsHttpEngine implements ITtsEngine {
  constructor() {
    // Store for future implementation
  }

  isSupported(): boolean {
    return false; // Not yet implemented
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return [];
  }

  async speak(): Promise<void> {
    throw new Error('OpenTTS HTTP engine not yet implemented');
  }

  cancel(): void {
    // No-op for stub
  }
}
