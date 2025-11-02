import type { ITtsEngine, ITtsService, TtsOptions } from '@/types';
import { TtsEngine } from '@/types';
import { WebSpeechEngine } from './engines/WebSpeechEngine';
import { EspeakWasmEngine } from './engines/EspeakWasmEngine';
import { OpenTtsHttpEngine } from './engines/OpenTtsHttpEngine';

/**
 * TTS service facade that manages multiple TTS engines
 */
export class TtsService implements ITtsService {
  private engine: ITtsEngine;

  constructor(preferredEngine?: TtsEngine) {
    this.engine = this.selectEngine(preferredEngine);
  }

  private selectEngine(preferredEngine?: TtsEngine): ITtsEngine {
    if (preferredEngine === TtsEngine.ESPEAK_WASM) {
      return this.tryEngine(new EspeakWasmEngine());
    }

    if (preferredEngine === TtsEngine.OPEN_TTS) {
      return this.tryEngine(new OpenTtsHttpEngine());
    }

    return this.selectDefaultEngine();
  }

  private selectDefaultEngine(): ITtsEngine {
    const webSpeech = new WebSpeechEngine();
    if (webSpeech.isSupported()) {
      return webSpeech;
    }

    return new EspeakWasmEngine();
  }

  private tryEngine(engine: ITtsEngine): ITtsEngine {
    return engine.isSupported() ? engine : new WebSpeechEngine();
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
