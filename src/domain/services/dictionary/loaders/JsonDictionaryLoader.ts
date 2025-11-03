import type { IDictionaryLoader, WordSet, GradeBand, LocaleCode } from '@/types';
import { WordSetSchema } from '@/types/schemas';

/**
 * JSON-based dictionary loader with schema validation
 */
export class JsonDictionaryLoader implements IDictionaryLoader {
  async load(gradeBand: GradeBand, locale: LocaleCode): Promise<WordSet> {
    const data = await this.fetchData(gradeBand, locale);
    return this.validate(data);
  }

  private async fetchData(gradeBand: GradeBand, locale: LocaleCode): Promise<unknown> {
    const path = this.buildPath(gradeBand, locale);
    const response = await fetch(path);

    if (!this.isResponseOk(response)) {
      throw new Error(`Failed to load dictionary: ${response.statusText}`);
    }

    return response.json();
  }

  private buildPath(gradeBand: GradeBand, locale: LocaleCode): string {
    const localePrefix = locale.split('-')[0];
    return `/data/dictionaries/${localePrefix}/${gradeBand}.json`;
  }

  private isResponseOk(response: Response): boolean {
    return response.ok;
  }

  validate(data: unknown): WordSet {
    return WordSetSchema.parse(data);
  }
}
