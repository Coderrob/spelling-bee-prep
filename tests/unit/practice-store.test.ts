import { describe, it, expect, beforeEach } from 'vitest';
import { usePracticeStore } from '../../src/store/practiceStore';
import { useProgressStore } from '../../src/store/progressStore';
import { Difficulty, GradeLevel, HintType, PracticeMode } from '../../src/types/enums';
import type { WordEntry } from '../../src/types/models';

describe('Practice Store', () => {
  const mockWords: WordEntry[] = [
    {
      id: 'test-apple',
      word: 'apple',
      gradeLevel: GradeLevel.THIRD,
      difficulty: Difficulty.EASY,
      definition: 'A fruit',
      sourceId: 'test',
    },
    {
      id: 'test-banana',
      word: 'banana',
      gradeLevel: GradeLevel.THIRD,
      difficulty: Difficulty.MEDIUM,
      definition: 'A yellow fruit',
      sourceId: 'test',
    },
    {
      id: 'test-cherry',
      word: 'cherry',
      gradeLevel: GradeLevel.THIRD,
      difficulty: Difficulty.HARD,
      definition: 'A red fruit',
      sourceId: 'test',
    },
  ];

  beforeEach(() => {
    const store = usePracticeStore.getState();
    store.resetSession();
    store.setWordPool([]);
    useProgressStore.setState({ attempts: [], mastery: {} });
  });

  it('should initialize with default values', () => {
    const state = usePracticeStore.getState();
    expect(state.currentWord).toBeNull();
    expect(state.userInput).toBe('');
    expect(state.isCorrect).toBeNull();
    expect(state.mode).toBe('random');
  });

  it('should set word pool', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    const updatedStore = usePracticeStore.getState();
    expect(updatedStore.wordPool).toHaveLength(3);
  });

  it('should get random word from pool', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    const word = store.getRandomWord();
    expect(word).not.toBeNull();
    expect(mockWords).toContainEqual(word);
  });

  it('should check correct answer', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setCurrentWord(mockWords[0]);
    store.setUserInput('apple');
    store.checkAnswer();
    const updatedStore = usePracticeStore.getState();
    expect(updatedStore.isCorrect).toBe(true);
  });

  it('should check incorrect answer', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setCurrentWord(mockWords[0]);
    store.setUserInput('wrong');
    store.checkAnswer();
    const updatedStore = usePracticeStore.getState();
    expect(updatedStore.isCorrect).toBe(false);
  });

  it('should filter words by difficulty', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setDifficulties([Difficulty.EASY]);
    const word = store.getRandomWord();
    expect(word?.difficulty).toBe(Difficulty.EASY);
  });

  it('should allow due words to override no-repeat tracking in adaptive mode', () => {
    const now = Date.now();
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setMode(PracticeMode.ADAPTIVE);
    usePracticeStore.setState({ usedWords: new Set([mockWords[0].id]) });
    useProgressStore.setState({
      mastery: {
        [mockWords[0].id]: {
          wordId: mockWords[0].id,
          stage: 0,
          attempts: 1,
          correctAttempts: 0,
          correctStreak: 0,
          lastSeenAt: now - 1_000,
          dueAt: now - 1,
        },
        ...Object.fromEntries(
          mockWords.slice(1).map((word) => [
            word.id,
            {
              wordId: word.id,
              stage: 1,
              attempts: 1,
              correctAttempts: 1,
              correctStreak: 1,
              lastSeenAt: now,
              dueAt: now + 86_400_000,
            },
          ])
        ),
      },
    });

    expect(store.getRandomWord()?.id).toBe(mockWords[0].id);
  });

  it('should toggle hint', () => {
    const store = usePracticeStore.getState();
    store.setCurrentWord(mockWords[0]);
    expect(store.showHint).toBe(false);
    store.toggleHint(HintType.DEFINITION);
    const updatedStore = usePracticeStore.getState();
    expect(updatedStore.showHint).toBe(true);
    expect(updatedStore.hintType).toBe('definition');
  });

  it('should reset session', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.nextWord();
    store.setUserInput('test');
    store.checkAnswer();

    store.resetSession();

    const resetStore = usePracticeStore.getState();
    expect(resetStore.currentWord).toBeNull();
    expect(resetStore.userInput).toBe('');
  });
});
