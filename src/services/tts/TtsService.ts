import type { ITtsEngine, ITtsService, TtsOptions } from '@/types';
import { TtsEngine } from '@/types';
import { TtsEngineFactory, type TtsEngineFactoryConfig } from './TtsEngineFactory';

export interface TtsServiceConfig extends TtsEngineFactoryConfig {
  preferredEngine?: TtsEngine;
}

const defaultOrder = [TtsEngine.WEB_SPEECH, TtsEngine.ESPEAK_WASM, TtsEngine.OPEN_TTS];

/** Chain-of-responsibility facade that retries speech with the next supported engine. */
export class TtsService implements ITtsService {
  private readonly engines: ITtsEngine[];
  private requestGeneration = 0;

  constructor(config: TtsServiceConfig = {}) {
    const factory = new TtsEngineFactory(config);
    const order = config.preferredEngine
      ? [
          config.preferredEngine,
          ...defaultOrder.filter((engine) => engine !== config.preferredEngine),
        ]
      : defaultOrder;
    this.engines = order.map((engine) => factory.create(engine));
  }

  async speak(text: string, options?: TtsOptions): Promise<void> {
    const requestGeneration = ++this.requestGeneration;
    const failures: unknown[] = [];
    for (const engine of this.engines) {
      if (requestGeneration !== this.requestGeneration) {
        return;
      }
      if (!engine.isSupported()) {
        continue;
      }
      try {
        await engine.speak(text, options);
        return;
      } catch (error) {
        if (requestGeneration !== this.requestGeneration) {
          return;
        }
        failures.push(error);
        console.warn('Speech engine failed; trying the next available engine.', error);
      }
    }
    throw new AggregateError(failures, 'No text-to-speech engine could speak the requested text');
  }

  cancel(): void {
    this.requestGeneration += 1;
    this.engines.forEach((engine) => engine.cancel());
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    for (const engine of this.engines) {
      if (engine.isSupported()) {
        try {
          return await engine.getVoices();
        } catch (error) {
          console.warn('Unable to load voices; trying the next speech engine.', error);
        }
      }
    }
    return [];
  }
}
