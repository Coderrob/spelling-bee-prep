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

import type {
  IDictionaryService,
  IDictionaryLoader,
  WordEntry,
  WordSet,
  GradeLevel,
} from '@/types';
import { GradeLevel as GradeLevelValue, LocaleCode } from '@/types';
import { getRandomItem } from '@/utils/random';

/**
 * Dictionary service for managing word sets
 */
export class DictionaryService implements IDictionaryService {
  private readonly loader: IDictionaryLoader;
  private readonly locale: LocaleCode;
  private readonly cache = new Map<GradeLevel, WordSet>();

  /**
   * Constructs a DictionaryService
   * @param loader - The dictionary loader
   * @param locale - The locale code
   */
  constructor(loader: IDictionaryLoader, locale: LocaleCode = LocaleCode.EN_US) {
    this.loader = loader;
    this.locale = locale;
  }

  /**
   * Retrieves word set for a specific grade band
   * @param gradeBand - The grade band to retrieve
   * @returns The word set for the specified grade band
   */
  async getWordSet(gradeLevel: GradeLevel): Promise<WordSet> {
    if (this.cache.has(gradeLevel)) {
      const cached = this.cache.get(gradeLevel);
      if (cached) {
        return cached;
      }
    }

    const wordSet = await this.loader.load(gradeLevel, this.locale);
    this.cache.set(gradeLevel, wordSet);
    return wordSet;
  }

  /** Returns every curriculum grade supported by the repository. */
  listGradeLevels(): readonly GradeLevel[] {
    return Object.values(GradeLevelValue);
  }

  /**
   * Retrieves words, optionally filtered by grade band
   * @param gradeBand - Optional grade band to filter words
   * @returns An array of word entries
   */
  async getWords(gradeLevel?: GradeLevel): Promise<WordEntry[]> {
    if (!gradeLevel) {
      return this.getAllWords();
    }

    const wordSet = await this.getWordSet(gradeLevel);
    return wordSet.words;
  }

  /**
   * Retrieves all words across all grade bands
   * @returns An array of all word entries
   */
  private async getAllWords(): Promise<WordEntry[]> {
    const sets = await Promise.all(this.listGradeLevels().map((grade) => this.getWordSet(grade)));
    return sets.flatMap((wordSet) => wordSet.words);
  }

  /**
   * Retrieves a random word, optionally filtered by grade band
   * @param gradeBand - Optional grade band to filter words
   * @returns A random word entry or null if no words are available
   */
  async getRandomWord(gradeLevel?: GradeLevel): Promise<WordEntry | null> {
    const words = await this.getWords(gradeLevel);
    return getRandomItem(words);
  }
}
