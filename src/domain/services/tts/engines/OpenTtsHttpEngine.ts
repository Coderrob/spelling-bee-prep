import type { ITtsEngine, TtsOptions } from '@/types';
import { hasAudioContextSupport, hasFetchSupport, wrapError } from '@/utils/common';
import { isEmptyString, isNull } from '@/utils/guards';

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

  constructor(baseUrl: string = 'http://localhost:5500') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash

    if (hasAudioContextSupport()) {
      this.audioContext = new AudioContext();
    }
  }

  isSupported(): boolean {
    // OpenTTS requires fetch API and AudioContext
    return hasFetchSupport() && !isNull(this.audioContext);
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported()) {
      return [];
    }

    try {
      await this.fetchAvailableVoices();
      // Return empty array as OpenTTS uses its own voice system
      return [];
    } catch (error) {
      console.error('Failed to fetch OpenTTS voices:', error);
      return [];
    }
  }

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

      this.availableVoices = await response.json();
    } catch (error) {
      // If we can't fetch voices, continue with empty list
      this.availableVoices = [];
      throw error;
    }
  }

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
      await this.playAudioData(audioData, options.volume || 1);
    } catch (error) {
      throw wrapError(error, 'OpenTTS synthesis failed');
    }
  }

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

  private selectVoice(lang?: string): string {
    if (!lang || this.availableVoices.length === 0) {
      return 'en-us'; // Default voice
    }

    // Try to find a matching voice by language
    const languagePrefix = lang.split('-')[0].toLowerCase();
    const matchingVoice = this.availableVoices.find((voice) =>
      voice.language.toLowerCase().startsWith(languagePrefix)
    );

    return matchingVoice?.id || 'en-us';
  }

  private normalizeRate(rate?: number): number {
    // OpenTTS typically accepts rates between 0.5 and 2.0
    return Math.max(0.5, Math.min(2.0, rate || 1.0));
  }

  private normalizePitch(pitch?: number): number {
    // OpenTTS typically accepts pitch between 0 and 100
    return Math.max(0, Math.min(100, pitch || 50));
  }

  private async playAudioData(audioData: ArrayBuffer, volume: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    return new Promise((resolve, reject) => {
      this.audioContext!.decodeAudioData(
        audioData,
        (audioBuffer) => {
          this.playAudioBuffer(audioBuffer, volume, resolve, reject);
        },
        (error) => {
          reject(new Error(`Failed to decode audio: ${error}`));
        }
      );
    });
  }

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
      reject(new Error(`Failed to play audio: ${error}`));
    }
  }

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
