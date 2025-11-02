import type { TTSService, TTSProvider } from './types';
import { WebSpeechService } from './web-speech-service';
import { FallbackTTSService } from './fallback-service';

export * from './types';
export { WebSpeechService } from './web-speech-service';
export { FallbackTTSService } from './fallback-service';

/**
 * Factory function to create the appropriate TTS service
 * Tries Web Speech API first, falls back to alternative if not supported
 */
export function createTTSService(preferredProvider?: TTSProvider): TTSService {
  if (preferredProvider === 'fallback') {
    return new FallbackTTSService();
  }

  const webSpeechService = new WebSpeechService();
  if (webSpeechService.isSupported()) {
    return webSpeechService;
  }

  console.warn('Web Speech API not supported, using fallback TTS service');
  return new FallbackTTSService();
}

// Singleton instance
let ttsServiceInstance: TTSService | null = null;

/**
 * Get the singleton TTS service instance
 */
export function getTTSService(): TTSService {
  if (!ttsServiceInstance) {
    ttsServiceInstance = createTTSService();
  }
  return ttsServiceInstance;
}

/**
 * Reset the TTS service instance (useful for testing)
 */
export function resetTTSService(): void {
  ttsServiceInstance = null;
}
