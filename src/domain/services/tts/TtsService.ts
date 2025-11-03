import type { ITtsEngine, ITtsService, TtsOptions } from '@/types';
import { TtsEngine } from '@/types';
import { WebSpeechEngine } from './engines/WebSpeechEngine';
import { EspeakWasmEngine } from './engines/EspeakWasmEngine';
import { OpenTtsHttpEngine } from './engines/OpenTtsHttpEngine';

interface TtsServiceConfig {
  preferredEngine?: TtsEngine;
  openTtsBaseUrl?: string;
}

/**
 * TTS service facade that manages multiple TTS engines
 */
export class TtsService implements ITtsService {
  private engine: ITtsEngine;
  private readonly config: TtsServiceConfig;

  constructor(config: TtsServiceConfig = {}) {
    this.config = config;
    this.engine = this.selectEngine(config.preferredEngine);
  }

  private selectEngine(preferredEngine?: TtsEngine): ITtsEngine {
    if (preferredEngine === TtsEngine.ESPEAK_WASM) {
      return this.tryEngine(new EspeakWasmEngine());
    }

    if (preferredEngine === TtsEngine.OPEN_TTS) {
      const baseUrl = this.config.openTtsBaseUrl || 'http://localhost:5500';
      return this.tryEngine(new OpenTtsHttpEngine(baseUrl));
    }

    return this.selectDefaultEngine();
  }

  private selectDefaultEngine(): ITtsEngine {
    const webSpeech = new WebSpeechEngine();
    if (webSpeech.isSupported()) {
      return webSpeech;
    }

    // Try OpenTTS as fallback if WebSpeech is not available
    const openTts = new OpenTtsHttpEngine(this.config.openTtsBaseUrl || 'http://localhost:5500');
    if (openTts.isSupported()) {
      return openTts;
    }

    // Finally try Espeak WASM
    return new EspeakWasmEngine();
  }

  private tryEngine(engine: ITtsEngine): ITtsEngine {
    return engine.isSupported() ? engine : this.selectDefaultEngine();
  }

  async speak(text: string, options?: TtsOptions): Promise<void> {
    return this.engine.speak(text, options);
  }

  cancel(): void {
    this.engine.cancel();
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return this.engine.getVoices();
  }
}
