/*
 * Copyright 2025 Robert Lindley
 * Licensed under the Apache License, Version 2.0.
 */

import type { GradeLevel, IDictionaryLoader, LocaleCode, WordSet } from '@/types';
import { WordSetSchema } from '@/types';

type BundledModuleLoader = () => Promise<unknown>;
type BundledModules = Partial<Record<string, BundledModuleLoader>>;

const bundledModules = import.meta.glob<unknown>('../../../data/dictionaries/**/*.json', {
  import: 'default',
});

/** Loads build-time JSON word packs and validates them at the repository boundary. */
export class BundledDictionaryLoader implements IDictionaryLoader {
  private readonly wordSets = new Map<string, WordSet>();

  constructor(private readonly modules: BundledModules = bundledModules) {}

  async load(gradeLevel: GradeLevel, locale: LocaleCode): Promise<WordSet> {
    const key = this.key(gradeLevel, locale);
    const cached = this.wordSets.get(key);
    if (cached) {
      return cached;
    }

    const path = `../../../data/dictionaries/${locale}/grade-${gradeLevel.toLocaleLowerCase()}.json`;
    const loadModule = this.modules[path];
    if (!loadModule) {
      throw new Error(`No bundled word set for grade ${gradeLevel} and locale ${locale}`);
    }
    const wordSet = this.validate(await loadModule());
    this.wordSets.set(key, wordSet);
    return wordSet;
  }

  validate(data: unknown): WordSet {
    return WordSetSchema.parse(data);
  }

  private key(gradeLevel: GradeLevel, locale: LocaleCode): string {
    return `${locale}:${gradeLevel}`;
  }
}
