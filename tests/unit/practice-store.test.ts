import { describe, it, expect, beforeEach } from 'vitest';
import { usePracticeStore } from '@/features/practice/store';
import { Word } from '@/data/dictionaries/schema';

describe('Practice Store', () => {
  const mockWords: Word[] = [
    {
      word: 'apple',
      difficulty: 'easy',
      definition: 'A fruit',
    },
    {
      word: 'banana',
      difficulty: 'medium',
      definition: 'A yellow fruit',
    },
    {
      word: 'cherry',
      difficulty: 'hard',
      definition: 'A red fruit',
    },
  ];

  beforeEach(() => {
    const store = usePracticeStore.getState();
    store.resetSession();
    store.setWordPool([]);
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
    expect(updatedStore.wordsCorrect).toBe(1);
    expect(updatedStore.currentStreak).toBe(1);
  });

  it('should check incorrect answer', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setCurrentWord(mockWords[0]);
    store.setUserInput('wrong');
    store.checkAnswer();
    const updatedStore = usePracticeStore.getState();
    expect(updatedStore.isCorrect).toBe(false);
    expect(updatedStore.wordsIncorrect).toBe(1);
    expect(updatedStore.currentStreak).toBe(0);
  });

  it('should filter words by difficulty', () => {
    const store = usePracticeStore.getState();
    store.setWordPool(mockWords);
    store.setMode('difficulty');
    store.setDifficulty('easy');
    const word = store.getRandomWord();
    expect(word?.difficulty).toBe('easy');
  });

  it('should toggle hint', () => {
    const store = usePracticeStore.getState();
    expect(store.showHint).toBe(false);
    store.toggleHint('definition');
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
    
    expect(store.currentWord).toBeNull();
    expect(store.userInput).toBe('');
    expect(store.wordsAttempted).toBe(0);
    expect(store.wordsCorrect).toBe(0);
  });
});
