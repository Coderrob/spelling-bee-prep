import type { ITtsEngine } from '@/types';
import { DEFAULT_BASE_URL, TtsEngine } from '@/types';
import { EspeakWasmEngine } from './engines/EspeakWasmEngine';
import { OpenTtsHttpEngine } from './engines/OpenTtsHttpEngine';
import { WebSpeechEngine } from './engines/WebSpeechEngine';

export interface TtsEngineFactoryConfig {
  openTtsBaseUrl?: string;
  engines?: Partial<Record<TtsEngine, ITtsEngine>>;
}

/** Factory for browser, local WASM, and HTTP speech adapters. */
export class TtsEngineFactory {
  constructor(private readonly config: TtsEngineFactoryConfig = {}) {}

  create(engine: TtsEngine): ITtsEngine {
    const injected = this.config.engines?.[engine];
    if (injected) {
      return injected;
    }

    switch (engine) {
      case TtsEngine.WEB_SPEECH:
        return new WebSpeechEngine();
      case TtsEngine.ESPEAK_WASM:
        return new EspeakWasmEngine();
      case TtsEngine.OPEN_TTS:
        return new OpenTtsHttpEngine(this.config.openTtsBaseUrl ?? DEFAULT_BASE_URL);
    }
  }
}
