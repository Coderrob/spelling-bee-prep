/*
 * Copyright 2025 Robert Lindley
 * Licensed under the Apache License, Version 2.0.
 */

import { create } from 'zustand';
import { DictionaryService } from '@/services/dictionary/DictionaryService';
import { BundledDictionaryLoader } from '@/services/dictionary/loaders/BundledDictionaryLoader';
import { GradeLevel, LocaleCode, type WordEntry } from '@/types';

export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CatalogState {
  selectedGrade: GradeLevel;
  words: WordEntry[];
  status: CatalogStatus;
  error: string | null;
}

interface CatalogActions {
  initialize: () => Promise<void>;
  selectGrade: (grade: GradeLevel) => Promise<void>;
}

type CatalogStore = CatalogState & CatalogActions;

const repository = new DictionaryService(new BundledDictionaryLoader(), LocaleCode.EN_US);

async function loadGrade(
  grade: GradeLevel,
  set: (state: Partial<CatalogState>) => void,
  get: () => CatalogStore
): Promise<void> {
  set({ selectedGrade: grade, status: 'loading', error: null });
  try {
    const words = await repository.getWords(grade);
    if (get().selectedGrade === grade) {
      set({ words, status: 'ready' });
    }
  } catch (error) {
    if (get().selectedGrade === grade) {
      set({
        words: [],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unable to load the word catalog',
      });
    }
  }
}

/** Focused store for curriculum selection and asynchronous catalog loading. */
export const useCatalogStore = create<CatalogStore>((set, get) => ({
  selectedGrade: GradeLevel.THIRD,
  words: [],
  status: 'idle',
  error: null,
  initialize: async () => {
    if (get().status === 'idle') {
      await loadGrade(get().selectedGrade, set, get);
    }
  },
  selectGrade: async (grade) => loadGrade(grade, set, get),
}));
