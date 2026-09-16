import { describe, expect, it } from 'vitest';
import { DictionaryService } from '../../src/services/dictionary/DictionaryService';
import { BundledDictionaryLoader } from '../../src/services/dictionary/loaders/BundledDictionaryLoader';
import { GradeLevel, LocaleCode } from '../../src/types';

describe('bundled word catalog', () => {
  const repository = new DictionaryService(new BundledDictionaryLoader(), LocaleCode.EN_US);
  const expectedCounts: Record<GradeLevel, number> = {
    [GradeLevel.KINDERGARTEN]: 100,
    [GradeLevel.FIRST]: 175,
    [GradeLevel.SECOND]: 175,
    [GradeLevel.THIRD]: 250,
    [GradeLevel.FOURTH]: 250,
    [GradeLevel.FIFTH]: 250,
    [GradeLevel.SIXTH]: 300,
    [GradeLevel.SEVENTH]: 300,
    [GradeLevel.EIGHTH]: 300,
    [GradeLevel.NINTH]: 300,
    [GradeLevel.TENTH]: 300,
    [GradeLevel.ELEVENTH]: 300,
    [GradeLevel.TWELFTH]: 300,
  };

  it('contains a validated word set for every grade', async () => {
    const sets = await Promise.all(
      Object.values(GradeLevel).map((grade) => repository.getWordSet(grade))
    );

    expect(sets).toHaveLength(13);
    for (const set of sets) {
      expect(set.words).toHaveLength(expectedCounts[set.gradeLevel]);
    }
    expect(sets.flatMap((set) => set.words)).toHaveLength(3300);
  });

  it('uses globally unique ids and spellings', async () => {
    const words = await repository.getWords();
    const ids = words.map((entry) => entry.id);
    const spellings = words.map((entry) => entry.word.toLocaleLowerCase());

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(spellings).size).toBe(spellings.length);
  });

  it('provides easy, medium, and hard practice in every grade', async () => {
    const sets = await Promise.all(
      Object.values(GradeLevel).map((grade) => repository.getWordSet(grade))
    );

    for (const set of sets) {
      expect(new Set(set.words.map((entry) => entry.difficulty))).toEqual(
        new Set(['easy', 'medium', 'hard'])
      );
    }
  });

  it('excludes known learner errors and unsuitable dictionary senses', async () => {
    const words = await repository.getWords();
    const spellings = new Set(words.map((entry) => entry.word.toLocaleLowerCase()));
    const rejectedSpellings = [
      'claire',
      'dalmation',
      'harrassing',
      'internation',
      'modernise',
      'unfortunatly',
    ];

    for (const spelling of rejectedSpellings) {
      expect(spellings.has(spelling)).toBe(false);
    }
    expect(
      words.every(
        (entry) =>
          !/given name|surname|standard spelling of|\(\d{4}[-–]\d{4}\)/i.test(entry.definition)
      )
    ).toBe(true);
  });
});
