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

import type { GradeBand, LocaleCode } from './enums';
import type { TtsOptions, WordEntry, WordSet } from './models';

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
