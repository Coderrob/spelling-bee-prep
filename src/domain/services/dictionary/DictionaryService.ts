import type { IDictionaryService, IDictionaryLoader, WordEntry, WordSet, GradeBand } from '@/types';
import { LocaleCode } from '@/types';
import { getRandomItem } from '@/utils/random';

/**
 * Dictionary service for managing word sets
 */
export class DictionaryService implements IDictionaryService {
  private readonly loader: IDictionaryLoader;
  private readonly locale: LocaleCode;
  private readonly cache: Map<GradeBand, WordSet> = new Map();

  constructor(loader: IDictionaryLoader, locale: LocaleCode = LocaleCode.EN_US) {
    this.loader = loader;
    this.locale = locale;
  }

  async getWordSet(gradeBand: GradeBand): Promise<WordSet> {
    if (this.hasCache(gradeBand)) {
      return this.getFromCache(gradeBand);
    }

    return this.loadAndCache(gradeBand);
  }

  private hasCache(gradeBand: GradeBand): boolean {
    return this.cache.has(gradeBand);
  }

  private getFromCache(gradeBand: GradeBand): WordSet {
    return this.cache.get(gradeBand)!;
  }

  private async loadAndCache(gradeBand: GradeBand): Promise<WordSet> {
    const wordSet = await this.loader.load(gradeBand, this.locale);
    this.cache.set(gradeBand, wordSet);
    return wordSet;
  }

  async getWords(gradeBand?: GradeBand): Promise<WordEntry[]> {
    if (!gradeBand) {
      return this.getAllWords();
    }

    const wordSet = await this.getWordSet(gradeBand);
    return wordSet.words;
  }

  private async getAllWords(): Promise<WordEntry[]> {
    // For now, return empty array when no grade band specified
    // Could be extended to load all grade bands
    return [];
  }

  async getRandomWord(gradeBand?: GradeBand): Promise<WordEntry | null> {
    const words = await this.getWords(gradeBand);
    return getRandomItem(words);
  }
}
