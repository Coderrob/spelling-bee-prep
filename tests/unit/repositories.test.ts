import { beforeEach, describe, expect, it } from 'vitest';
import { DictionaryService } from '../../src/services/dictionary/DictionaryService';
import { BundledDictionaryLoader } from '../../src/services/dictionary/loaders/BundledDictionaryLoader';
import { LocalProgressRepository } from '../../src/services/progress/LocalProgressRepository';
import { Difficulty, GradeLevel, LocaleCode, type ProgressSnapshot } from '../../src/types';

describe('repository adapters', () => {
  beforeEach(() => globalThis.localStorage.clear());

  it('loads words for an individual grade and across the catalog', async () => {
    const repository = new DictionaryService(new BundledDictionaryLoader(), LocaleCode.EN_US);

    await expect(repository.getWords(GradeLevel.FIFTH)).resolves.toHaveLength(250);
    await expect(repository.getWords()).resolves.toHaveLength(3300);
  });

  it('round-trips versioned learner progress', () => {
    const repository = new LocalProgressRepository();
    const snapshot: ProgressSnapshot = {
      version: 1,
      attempts: [
        {
          wordId: 'g1-ship',
          word: 'ship',
          correct: true,
          difficulty: Difficulty.EASY,
          gradeLevel: GradeLevel.FIRST,
          timestamp: 100,
        },
      ],
      mastery: {
        'g1-ship': {
          wordId: 'g1-ship',
          stage: 1,
          attempts: 1,
          correctAttempts: 1,
          correctStreak: 1,
          lastSeenAt: 100,
          dueAt: 200,
        },
      },
    };

    repository.save(snapshot);
    expect(repository.load()).toEqual(snapshot);
    repository.clear();
    expect(repository.load()).toEqual({ version: 1, attempts: [], mastery: {} });
  });
});
