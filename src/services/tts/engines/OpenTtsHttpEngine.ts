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

import { LocaleCode, type ITtsEngine, type TtsOptions } from '@/types';
import { DEFAULT_BASE_URL, DEFAULT_SPEECH_RATE, DEFAULT_SPEECH_VOLUME } from '@/types/constants';
import { hasAudioContextSupport, hasFetchSupport, wrapError } from '@/utils/common';
import { isEmptyString, isNull } from '@/utils/guards';
import { logger } from '@/utils/logger';

/**
 * Represents a voice available in OpenTTS
 */
interface OpenTtsVoice {
  id: string;
  name: string;
  language: string;
  gender?: string;
}

/**
 * OpenTTS HTTP API engine implementation
 * Connects to an OpenTTS server for text-to-speech synthesis
 */
export class OpenTtsHttpEngine implements ITtsEngine {
  private readonly baseUrl: string;
  private readonly audioContext: AudioContext | null = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private availableVoices: OpenTtsVoice[] = [];

  /**
   * Constructs an OpenTTS HTTP engine
   * @param baseUrl - The base URL of the OpenTTS server
   */
  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash

    if (hasAudioContextSupport()) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Checks if OpenTTS engine is supported in the current environment
   * @returns True if supported, false otherwise
   */
  isSupported(): boolean {
    // OpenTTS requires fetch API and AudioContext
    return hasFetchSupport() && !isNull(this.audioContext);
  }

  /**
   * Retrieves available voices from OpenTTS server
   * @returns Promise resolving to an array of SpeechSynthesisVoice
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported()) {
      return [];
    }

    try {
      await this.fetchAvailableVoices();
      // Return empty array as OpenTTS uses its own voice system
      return [];
    } catch (error) {
      logger.error(
        'Failed to fetch OpenTTS voices',
        error instanceof Error ? error : new Error(String(error))
      );
      return [];
    }
  }

  /**
   * Fetches available voices from OpenTTS server
   * @throws Error if fetching voices fails
   * @return Promise that resolves when voices are fetched
   */
  private async fetchAvailableVoices(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/voices`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.availableVoices = (await response.json()) as OpenTtsVoice[];
    } catch (error) {
      // If we can't fetch voices, continue with empty list
      this.availableVoices = [];
      throw error;
    }
  }

  /**
   * Speaks the given text using OpenTTS
   * @param text - The text to speak
   * @param options - TTS options
   * @throws Error if synthesis fails or engine is unsupported
   * @return Promise that resolves when speaking is complete
   */
  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('OpenTTS engine is not supported in this environment');
    }

    if (isEmptyString(text)) {
      return;
    }

    this.cancel();

    try {
      const audioData = await this.synthesizeText(text, options);
      await this.playAudioData(audioData, options.volume ?? DEFAULT_SPEECH_VOLUME);
    } catch (error) {
      throw wrapError(error, 'OpenTTS synthesis failed');
    }
  }

  /**
   * Sends text to OpenTTS server for synthesis
   * @param text - The text to synthesize
   * @param options - TTS options
   * @returns The synthesized audio data as ArrayBuffer
   */
  private async synthesizeText(text: string, options: TtsOptions): Promise<ArrayBuffer> {
    const voice = this.selectVoice(options.lang);
    const rate = this.normalizeRate(options.rate);
    const pitch = this.normalizePitch(options.pitch);

    const requestBody = {
      text,
      voice,
      rate,
      pitch,
    };

    const response = await fetch(`${this.baseUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/wav',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  /**
   * Selects the appropriate voice based on language code
   * @param lang - The language code (e.g., 'en-US', 'es-ES')
   * @returns The OpenTTS voice identifier
   */
  private selectVoice(lang?: string): string {
    if (!lang || this.availableVoices.length === 0) {
      return LocaleCode.EN_US; // Default voice
    }

    // Try to find a matching voice by language
    const languagePrefix = lang.split('-')[0].toLowerCase();
    const matchingVoice = this.availableVoices.find((voice) =>
      voice.language.toLowerCase().startsWith(languagePrefix)
    );

    return matchingVoice?.id ?? LocaleCode.EN_US;
  }

  /**
   * Normalizes the speech rate for OpenTTS
   * @param rate - The desired rate multiplier
   * @returns Normalized rate value
   */
  private normalizeRate(rate?: number): number {
    // OpenTTS typically accepts rates between 0.5 and 2.0
    return Math.max(0.5, Math.min(2, rate ?? DEFAULT_SPEECH_RATE));
  }

  /**
   * Normalizes the pitch for OpenTTS
   * @param pitch - The desired pitch value
   * @returns Normalized pitch value
   */
  private normalizePitch(pitch?: number): number {
    // OpenTTS typically accepts pitch between 0 and 100
    return Math.max(0, Math.min(100, pitch ?? 50));
  }

  /**
   * Plays the given audio data through Web Audio API
   * @param audioData - The audio data as ArrayBuffer
   * @param volume - Volume level (0.0 to 1.0)
   */
  private async playAudioData(audioData: ArrayBuffer, volume: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    return new Promise((resolve, reject) => {
      if (!this.audioContext) {
        reject(new Error('AudioContext not available'));
        return;
      }

      void this.audioContext.decodeAudioData(
        audioData,
        (audioBuffer) => {
          this.playAudioBuffer(audioBuffer, volume, resolve, reject);
        },
        (error) => {
          reject(new Error(`Failed to decode audio: ${String(error)}`));
        }
      );
    });
  }

  /**
   * Plays the given AudioBuffer through Web Audio API
   * @param audioBuffer - The AudioBuffer to play
   * @param volume - Volume level (0.0 to 1.0)
   * @param resolve - Promise resolve function
   * @param reject - Promise reject function
   */
  private playAudioBuffer(
    audioBuffer: AudioBuffer,
    volume: number,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    if (!this.audioContext) {
      reject(new Error('AudioContext not available'));
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = Math.max(0, Math.min(1, volume));

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.onended = () => {
        this.currentAudioSource = null;
        resolve();
      };

      this.currentAudioSource = source;
      source.start(0);
    } catch (error) {
      reject(new Error(`Failed to play audio: ${String(error)}`));
    }
  }

  /**
   * Cancels any ongoing speech synthesis
   */
  cancel(): void {
    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
      } catch {
        // Ignore errors if already stopped
      }
      this.currentAudioSource = null;
    }
  }
}
