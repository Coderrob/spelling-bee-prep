import { describe, it, expect, beforeEach } from 'vitest';
import { createTTSService, resetTTSService } from '@/domain/services/tts';
import { WebSpeechService } from '@/domain/services/tts/web-speech-service';
import { FallbackTTSService } from '@/domain/services/tts/fallback-service';

describe('TTS Service', () => {
  beforeEach(() => {
    resetTTSService();
  });

  describe('createTTSService', () => {
    it('should create a Web Speech service when supported', () => {
      const service = createTTSService();
      expect(service).toBeInstanceOf(WebSpeechService);
    });

    it('should create a fallback service when requested', () => {
      const service = createTTSService('fallback');
      expect(service).toBeInstanceOf(FallbackTTSService);
    });
  });

  describe('WebSpeechService', () => {
    it('should be supported in test environment', () => {
      const service = new WebSpeechService();
      expect(service.isSupported()).toBe(true);
    });

    it('should speak text', async () => {
      const service = new WebSpeechService();
      await expect(service.speak('hello')).resolves.toBeUndefined();
    });

    it('should get voices', async () => {
      const service = new WebSpeechService();
      const voices = await service.getVoices();
      expect(Array.isArray(voices)).toBe(true);
    });
  });

  describe('FallbackTTSService', () => {
    it('should always be supported', () => {
      const service = new FallbackTTSService();
      expect(service.isSupported()).toBe(true);
    });

    it('should speak text with fallback', async () => {
      const service = new FallbackTTSService();
      await expect(service.speak('hello')).resolves.toBeUndefined();
    });
  });
});
