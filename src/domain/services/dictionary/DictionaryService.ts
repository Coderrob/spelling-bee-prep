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
  async getWordSet(gradeBand: GradeBand): Promise<WordSet> {
    if (this.hasCache(gradeBand)) {
      return this.getFromCache(gradeBand);
    }

    return this.loadAndCache(gradeBand);
  }

  /**
   * Checks if word set is cached
   * @param gradeBand - The grade band to check
   * @returns True if cached, false otherwise
   */
  private hasCache(gradeBand: GradeBand): boolean {
    return this.cache.has(gradeBand);
  }

  /**
   * Retrieves word set from cache
   * @param gradeBand - The grade band to retrieve
   * @returns The cached word set
   */
  private getFromCache(gradeBand: GradeBand): WordSet {
    return this.cache.get(gradeBand)!;
  }

  /**
   * Loads word set and caches it
   * @param gradeBand - The grade band to load
   * @returns The loaded word set
   */
  private async loadAndCache(gradeBand: GradeBand): Promise<WordSet> {
    const wordSet = await this.loader.load(gradeBand, this.locale);
    this.cache.set(gradeBand, wordSet);
    return wordSet;
  }

  /**
   * Retrieves words, optionally filtered by grade band
   * @param gradeBand - Optional grade band to filter words
   * @returns An array of word entries
   */
  async getWords(gradeBand?: GradeBand): Promise<WordEntry[]> {
    if (!gradeBand) {
      return this.getAllWords();
    }

    const wordSet = await this.getWordSet(gradeBand);
    return wordSet.words;
  }

  /**
   * Retrieves all words across all grade bands
   * @returns An array of all word entries
   */
  private async getAllWords(): Promise<WordEntry[]> {
    // For now, return empty array when no grade band specified
    // Could be extended to load all grade bands
    return [];
  }

  /**
   * Retrieves a random word, optionally filtered by grade band
   * @param gradeBand - Optional grade band to filter words
   * @returns A random word entry or null if no words are available
   */
  async getRandomWord(gradeBand?: GradeBand): Promise<WordEntry | null> {
    const words = await this.getWords(gradeBand);
    return getRandomItem(words);
  }
}
