import type { TTSOptions, TTSService } from './types';

/**
 * Fallback TTS service for browsers without Web Speech API support
 * In a production app, this would integrate with espeak-ng-wasm or OpenTTS
 * For now, it provides a console-based fallback
 */
export class FallbackTTSService implements TTSService {
  isSupported(): boolean {
    return true; // Fallback is always "supported"
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    // Fallback service doesn't provide voices
    return [];
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    console.warn('TTS Fallback: Speaking text:', text, 'with options:', options);

    // In a real implementation, this would:
    // 1. Use espeak-ng-wasm for client-side synthesis
    // 2. Make API calls to OpenTTS server
    // 3. Use HTML5 audio to play pre-generated audio

    // For now, simulate async speech with a delay
    return new Promise((resolve) => {
      const words = text.split(' ');
      const duration = words.length * 500; // 500ms per word
      setTimeout(resolve, duration);
    });
  }

  cancel(): void {
    console.warn('TTS Fallback: Cancel speech');
  }
}
