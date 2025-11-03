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

import type { IDictionaryLoader, WordSet, GradeBand, LocaleCode } from '@/types';
import { WordSetSchema } from '@/types/schemas';

/**
 * JSON-based dictionary loader with schema validation
 */
export class JsonDictionaryLoader implements IDictionaryLoader {
  /**
   * Loads dictionary data for a specific grade band and locale
   * @param gradeBand - The grade band for the dictionary
   * @param locale - The locale code for the dictionary
   * @returns The loaded and validated WordSet
   */
  async load(gradeBand: GradeBand, locale: LocaleCode): Promise<WordSet> {
    const data = await this.fetchData(gradeBand, locale);
    return this.validate(data);
  }

  /**
   * Fetches dictionary data from JSON files
   * @param gradeBand - The grade band for the dictionary
   * @param locale - The locale code for the dictionary
   * @returns The fetched dictionary data
   */
  private async fetchData(gradeBand: GradeBand, locale: LocaleCode): Promise<unknown> {
    const path = this.buildPath(gradeBand, locale);
    const response = await fetch(path);

    if (!this.isResponseOk(response)) {
      throw new Error(`Failed to load dictionary: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Builds the file path for the dictionary JSON file
   * @param gradeBand - The grade band for the dictionary
   * @param locale - The locale code for the dictionary
   * @returns The constructed file path
   */
  private buildPath(gradeBand: GradeBand, locale: LocaleCode): string {
    const localePrefix = locale.split('-')[0];
    return `/data/dictionaries/${localePrefix}/${gradeBand}.json`;
  }

  /**
   * Checks if the fetch response is OK
   * @param response - The fetch response
   * @returns True if the response is OK, false otherwise
   */
  private isResponseOk(response: Response): boolean {
    return response.ok;
  }

  /**
   * Validates the fetched data against the WordSet schema
   * @param data - The fetched dictionary data
   * @returns The validated WordSet
   */
  validate(data: unknown): WordSet {
    return WordSetSchema.parse(data);
  }
}
