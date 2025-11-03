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
