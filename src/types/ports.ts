import type { TtsOptions, WordEntry, WordSet } from './models';
import type { GradeBand, LocaleCode } from './enums';

/**
 * Interface for TTS engine implementations
 */
export interface ITtsEngine {
  speak(text: string, options?: TtsOptions): Promise<void>;
  cancel(): void;
  isSupported(): boolean;
  getVoices(): Promise<SpeechSynthesisVoice[]>;
}

/**
 * Interface for TTS service facade
 */
export interface ITtsService {
  speak(text: string, options?: TtsOptions): Promise<void>;
  cancel(): void;
  getVoices(): Promise<SpeechSynthesisVoice[]>;
}

/**
 * Interface for dictionary data loaders
 */
export interface IDictionaryLoader {
  load(gradeBand: GradeBand, locale: LocaleCode): Promise<WordSet>;
  validate(data: unknown): WordSet;
}

/**
 * Interface for dictionary service
 */
export interface IDictionaryService {
  getWords(gradeBand?: GradeBand): Promise<WordEntry[]>;
  getWordSet(gradeBand: GradeBand): Promise<WordSet>;
  getRandomWord(gradeBand?: GradeBand): Promise<WordEntry | null>;
}
