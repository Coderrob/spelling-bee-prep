/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ITtsEngine, ITtsService, TtsOptions } from '@/types';
import { DEFAULT_BASE_URL, TtsEngine } from '@/types';
import { EspeakWasmEngine } from './engines/EspeakWasmEngine';
import { OpenTtsHttpEngine } from './engines/OpenTtsHttpEngine';
import { WebSpeechEngine } from './engines/WebSpeechEngine';

/**
 * Configuration options for TTS service
 */
interface TtsServiceConfig {
  preferredEngine?: TtsEngine;
  openTtsBaseUrl?: string;
}

/**
 * TTS service facade that manages multiple TTS engines
 */
export class TtsService implements ITtsService {
  private readonly engine: ITtsEngine;
  private readonly config: TtsServiceConfig;

  /**
   * Constructs a TTS service
   * @param config - Configuration options for the TTS service
   */
  constructor(config: TtsServiceConfig = {}) {
    this.config = config;
    this.engine = this.selectEngine(config.preferredEngine);
  }

  /**
   * Selects the TTS engine based on preferred engine and environment support
   * @param preferredEngine - The preferred TTS engine
   * @returns The selected TTS engine
   */
  private selectEngine(preferredEngine?: TtsEngine): ITtsEngine {
    if (preferredEngine === TtsEngine.ESPEAK_WASM) {
      return this.tryEngine(new EspeakWasmEngine());
    }

    if (preferredEngine === TtsEngine.OPEN_TTS) {
      const baseUrl = this.config.openTtsBaseUrl ?? DEFAULT_BASE_URL;
      return this.tryEngine(new OpenTtsHttpEngine(baseUrl));
    }

    return this.selectDefaultEngine();
  }

  /**
   * Selects the default TTS engine based on environment support
   * @returns The selected default TTS engine
   */
  private selectDefaultEngine(): ITtsEngine {
    const webSpeech = new WebSpeechEngine();
    if (webSpeech.isSupported()) {
      return webSpeech;
    }

    // Try OpenTTS as fallback if WebSpeech is not available
    const openTts = new OpenTtsHttpEngine(this.config.openTtsBaseUrl ?? DEFAULT_BASE_URL);
    if (openTts.isSupported()) {
      return openTts;
    }

    // Finally try Espeak WASM
    return new EspeakWasmEngine();
  }

  /**
   * Tries the given TTS engine and falls back to default if not supported
   * @param engine - The TTS engine to try
   * @returns The selected TTS engine
   */
  private tryEngine(engine: ITtsEngine): ITtsEngine {
    return engine.isSupported() ? engine : this.selectDefaultEngine();
  }

  /**
   * Speaks the given text using the selected TTS engine
   * @param text - The text to speak
   * @param options - TTS options
   * @returns Promise that resolves when speaking is complete
   */
  async speak(text: string, options?: TtsOptions): Promise<void> {
    return this.engine.speak(text, options);
  }

  /**
   * Cancels any ongoing speech synthesis
   */
  cancel(): void {
    this.engine.cancel();
  }

  /**
   * Retrieves available voices from the current TTS engine
   * @returns Promise resolving to an array of SpeechSynthesisVoice
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return this.engine.getVoices();
  }
}
