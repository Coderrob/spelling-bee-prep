import { describe, expect, it, vi } from 'vitest';
import { TtsService } from '../../src/services/tts/TtsService';
import { TtsEngine, type ITtsEngine } from '../../src/types';

function stubEngine(speak: ITtsEngine['speak']): ITtsEngine {
  return {
    speak,
    cancel: vi.fn(),
    isSupported: () => true,
    getVoices: () => Promise.resolve([]),
  };
}

describe('TtsService', () => {
  it('falls through to the next engine after a runtime failure', async () => {
    const fallbackSpeak = vi.fn(async () => Promise.resolve());
    const service = new TtsService({
      preferredEngine: TtsEngine.WEB_SPEECH,
      engines: {
        [TtsEngine.WEB_SPEECH]: stubEngine(async () => Promise.reject(new Error('failed'))),
        [TtsEngine.ESPEAK_WASM]: stubEngine(fallbackSpeak),
        [TtsEngine.OPEN_TTS]: stubEngine(async () => Promise.resolve()),
      },
    });

    await expect(service.speak('example')).resolves.toBeUndefined();
    expect(fallbackSpeak).toHaveBeenCalledWith('example', undefined);
  });

  it('does not fall through after a request is cancelled', async () => {
    let rejectPrimary: ((reason: Error) => void) | undefined;
    const primary = stubEngine(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectPrimary = reject;
        })
    );
    const fallbackSpeak = vi.fn(async () => Promise.resolve());
    const service = new TtsService({
      preferredEngine: TtsEngine.WEB_SPEECH,
      engines: {
        [TtsEngine.WEB_SPEECH]: primary,
        [TtsEngine.ESPEAK_WASM]: stubEngine(fallbackSpeak),
        [TtsEngine.OPEN_TTS]: stubEngine(async () => Promise.resolve()),
      },
    });

    const speaking = service.speak('first');
    service.cancel();
    rejectPrimary?.(new Error('cancelled'));

    await expect(speaking).resolves.toBeUndefined();
    expect(fallbackSpeak).not.toHaveBeenCalled();
  });
});
