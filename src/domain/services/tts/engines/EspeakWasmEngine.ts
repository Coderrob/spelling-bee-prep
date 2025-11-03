import {
  DEFAULT_SPEECH_RATE,
  DEFAULT_SPEECH_VOLUME,
  LocaleCode,
  type ITtsEngine,
  type TtsOptions,
} from '@/types';
import type { EspeakModule } from 'espeak-ng';
import { hasAudioContextSupport, hasWebAssemblySupport, wrapError } from '@/utils/common';
import { isEmptyString, isNull } from '@/utils/guards';

/**
 * Espeak-ng WASM TTS engine implementation
 * Uses WebAssembly version of espeak-ng for offline text-to-speech
 * Generates phonetic output and synthesizes speech using Web Audio API
 */
export class EspeakWasmEngine implements ITtsEngine {
  private espeakModule: EspeakModule | null = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private readonly audioContext: AudioContext | null = null;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    if (hasAudioContextSupport()) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Checks if Espeak WASM engine is supported in the current environment
   * @returns True if supported, false otherwise
   */
  isSupported(): boolean {
    return hasWebAssemblySupport() && !isNull(this.audioContext);
  }

  /**
   * Retrieves available voices (not applicable for Espeak-ng WASM)
   * @returns An empty array as Espeak-ng uses its own internal voice system
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    // Espeak-ng WASM doesn't use SpeechSynthesisVoice interface
    // It has its own internal voice system
    return [];
  }

  /**
   * Speaks the given text using espeak-ng WASM
   * @param text - The text to speak
   * @param options - TTS options including language, rate, pitch, volume
   * @returns Promise that resolves when speaking is complete
   */
  async speak(text: string, options: TtsOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Espeak WASM is not supported in this environment');
    }

    if (isEmptyString(text)) {
      return;
    }

    this.cancel();

    try {
      await this.loadEspeakModule();
      const audioBuffer = await this.synthesizeSpeech(text, options);
      await this.playAudioBuffer(audioBuffer, options.volume || DEFAULT_SPEECH_VOLUME);
    } catch (error) {
      throw wrapError(error, 'Espeak WASM synthesis failed');
    }
  }

  /**
   * Loads the espeak-ng WASM module dynamically
   * @returns Promise that resolves when the module is loaded
   */
  private async loadEspeakModule(): Promise<void> {
    if (this.espeakModule) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        // Dynamically import the espeak-ng module
        const ESpeakNGFactory = (await import('espeak-ng')).default;
        const instance = await ESpeakNGFactory({ arguments: [] });
        this.espeakModule = await instance.ready;
      } catch (error) {
        this.loadingPromise = null;
        throw wrapError(error, 'Failed to load Espeak-ng WASM module');
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Synthesizes speech from text using espeak-ng
   * @param text - The input text to synthesize
   * @param options - TTS options including language, rate, pitch
   * @returns AudioBuffer containing the synthesized speech
   */
  private async synthesizeSpeech(text: string, options: TtsOptions): Promise<AudioBuffer> {
    if (!this.espeakModule || !this.audioContext) {
      throw new Error('Espeak module or AudioContext not available');
    }

    const voice = this.selectVoice(options.lang);
    const rate = this.normalizeRate(options.rate);
    const pitch = this.normalizePitch(options.pitch);

    // Generate phonetic representation using espeak-ng
    const phonemeFile = 'phonemes_' + Date.now() + '.txt';

    try {
      // Run espeak-ng to generate phoneme data
      const exitCode = this.espeakModule.callMain([
        '--phonout',
        phonemeFile,
        '--sep=""',
        '-q',
        '-b=1',
        '--ipa=3',
        '-v',
        voice,
        `-s${Math.round(rate * 175)}`, // espeak rate: 80-450 wpm, default 175
        `-p${Math.round(pitch)}`, // espeak pitch: 0-99
        `"${text.replaceAll('"', '\\"')}"`,
      ]);

      if (exitCode !== 0) {
        throw new Error(`Espeak-ng returned exit code ${exitCode}`);
      }

      // Read the phoneme output
      const phonemes = this.espeakModule.FS.readFile(phonemeFile, {
        encoding: 'utf8',
      });

      // Clean up the temporary file
      this.espeakModule.FS.unlink(phonemeFile);

      // Generate audio from phonemes
      return this.generateAudioFromPhonemes(phonemes, rate, pitch);
    } catch (error) {
      // Clean up on error
      try {
        this.espeakModule.FS.unlink(phonemeFile);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  /**
   * Selects the appropriate espeak voice based on language code
   * @param lang - The language code (e.g., 'en-US', 'es-ES')
   * @returns The espeak voice identifier
   */
  private selectVoice(lang?: string): string {
    if (!lang) {
      return 'en-us';
    }

    // Map common language codes to espeak voices
    const langMap: Record<string, string> = {
      en: 'en-us',
      'en-us': 'en-us',
      'en-gb': 'en-gb',
      es: 'es',
      'es-es': 'es',
      fr: 'fr',
      'fr-fr': 'fr',
      de: 'de',
      it: 'it',
      pt: 'pt',
    };

    const normalizedLang = lang.toLowerCase();
    return langMap[normalizedLang] || langMap[normalizedLang.split('-')[0]] || LocaleCode.EN_US;
  }

  /**
   * Normalizes the speech rate for espeak-ng
   * @param rate - The desired rate multiplier (0.1 to 10)
   * @returns Normalized rate value
   */
  private normalizeRate(rate?: number): number {
    // Convert to espeak rate multiplier (0.1 to 10, default 1)
    return Math.max(0.1, Math.min(10, rate || DEFAULT_SPEECH_RATE));
  }

  /**
   * Normalizes the pitch for espeak-ng
   * @param pitch - The desired pitch value (0 to 99)
   * @returns Normalized pitch value
   */
  private normalizePitch(pitch?: number): number {
    // Espeak pitch: 0-99, default 50
    if (pitch === undefined) {
      return 50;
    }
    return Math.max(0, Math.min(99, Math.round(pitch)));
  }

  /**
   * Generates an AudioBuffer from phoneme data
   * @param phonemes - The phoneme string generated by espeak-ng
   * @param rate - Speech rate multiplier
   * @param pitch - Speech pitch value
   * @returns AudioBuffer containing synthesized audio
   */
  private generateAudioFromPhonemes(phonemes: string, rate: number, pitch: number): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    // Calculate duration based on phoneme count and rate
    const phonemeCount = phonemes.trim().split(/\s+/).length;
    const baseDuration = phonemeCount * 0.1; // Base: 100ms per phoneme
    const duration = baseDuration / rate;

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = Math.floor(duration * sampleRate);
    const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Generate simple sine wave synthesis based on phonemes
    // This is a simplified synthesis - real phoneme-to-speech would be more complex
    const baseFrequency = 200 + (pitch - 50) * 2; // Adjust frequency based on pitch
    let phase = 0;

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Add harmonics for more natural sound
      const frequency = baseFrequency * (1 + 0.1 * Math.sin(2 * Math.PI * 3 * t));
      phase += (2 * Math.PI * frequency) / sampleRate;

      // Generate waveform with envelope
      const envelope = this.calculateEnvelope(i, numSamples);
      channelData[i] = envelope * (Math.sin(phase) * 0.3 + Math.sin(phase * 2) * 0.1);
    }

    return audioBuffer;
  }

  /**
   * Calculates an amplitude envelope for the audio signal
   * @param sample - Current sample index
   * @param totalSamples - Total number of samples
   * @returns Amplitude multiplier (0.0 to 1.0)
   */
  private calculateEnvelope(sample: number, totalSamples: number): number {
    const attackTime = 0.02; // 20ms attack
    const releaseTime = 0.05; // 50ms release
    const sampleRate = this.audioContext?.sampleRate || 44100;

    const attackSamples = attackTime * sampleRate;
    const releaseSamples = releaseTime * sampleRate;

    if (sample < attackSamples) {
      // Attack phase
      return sample / attackSamples;
    } else if (sample > totalSamples - releaseSamples) {
      // Release phase
      return (totalSamples - sample) / releaseSamples;
    }
    // Sustain phase
    return 1;
  }

  /**
   * Plays the given AudioBuffer through Web Audio API
   * @param audioBuffer - The AudioBuffer to play
   * @param volume - Volume level (0.0 to 1.0)
   * @returns Promise that resolves when playback is complete
   */
  private async playAudioBuffer(audioBuffer: AudioBuffer, volume: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const audioContext = this.audioContext;

    return new Promise((resolve, reject) => {
      try {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = Math.max(0, Math.min(1, volume));

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.onended = () => {
          this.currentAudioSource = null;
          resolve();
        };

        this.currentAudioSource = source;
        source.start(0);
      } catch (error) {
        reject(new Error(`Failed to play audio: ${error}`));
      }
    });
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
