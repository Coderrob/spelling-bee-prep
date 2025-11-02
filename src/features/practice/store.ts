import { create } from 'zustand';
import type { Word } from '@/data/dictionaries/schema';

export type PracticeMode = 'random' | 'difficulty' | 'challenges';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PracticeState {
  // Current practice session
  currentWord: Word | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  hintType: 'definition' | 'usageExample' | 'origin' | null;

  // Practice settings
  mode: PracticeMode;
  selectedDifficulty: Difficulty | null;

  // Session statistics
  wordsAttempted: number;
  wordsCorrect: number;
  wordsIncorrect: number;
  currentStreak: number;

  // Available words
  wordPool: Word[];
  usedWords: Set<string>;

  // Actions
  setCurrentWord: (word: Word | null) => void;
  setUserInput: (input: string) => void;
  checkAnswer: () => void;
  nextWord: () => void;
  toggleHint: (hintType?: 'definition' | 'usageExample' | 'origin') => void;
  setMode: (mode: PracticeMode) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setWordPool: (words: Word[]) => void;
  resetSession: () => void;
  getRandomWord: () => Word | null;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  // Initial state
  currentWord: null,
  userInput: '',
  isCorrect: null,
  showHint: false,
  hintType: null,

  mode: 'random',
  selectedDifficulty: null,

  wordsAttempted: 0,
  wordsCorrect: 0,
  wordsIncorrect: 0,
  currentStreak: 0,

  wordPool: [],
  usedWords: new Set(),

  // Actions
  setCurrentWord: (word) =>
    set({ currentWord: word, userInput: '', isCorrect: null, showHint: false, hintType: null }),

  setUserInput: (input) => set({ userInput: input }),

  checkAnswer: () => {
    const { currentWord, userInput, wordsCorrect, wordsIncorrect, currentStreak, usedWords } =
      get();
    if (!currentWord) return;

    const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();
    const newUsedWords = new Set(usedWords);
    newUsedWords.add(currentWord.word);

    set({
      isCorrect,
      wordsAttempted: get().wordsAttempted + 1,
      wordsCorrect: isCorrect ? wordsCorrect + 1 : wordsCorrect,
      wordsIncorrect: isCorrect ? wordsIncorrect : wordsIncorrect + 1,
      currentStreak: isCorrect ? currentStreak + 1 : 0,
      usedWords: newUsedWords,
    });
  },

  nextWord: () => {
    const word = get().getRandomWord();
    get().setCurrentWord(word);
  },

  toggleHint: (hintType) => {
    const { showHint, hintType: currentHintType } = get();
    if (hintType) {
      set({ showHint: true, hintType });
    } else {
      set({ showHint: !showHint, hintType: showHint ? null : currentHintType || 'definition' });
    }
  },

  setMode: (mode) => set({ mode, usedWords: new Set() }),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty, usedWords: new Set() }),

  setWordPool: (words) => set({ wordPool: words, usedWords: new Set() }),

  resetSession: () =>
    set({
      currentWord: null,
      userInput: '',
      isCorrect: null,
      showHint: false,
      hintType: null,
      wordsAttempted: 0,
      wordsCorrect: 0,
      wordsIncorrect: 0,
      currentStreak: 0,
      usedWords: new Set(),
    }),

  getRandomWord: () => {
    const { wordPool, usedWords, mode, selectedDifficulty } = get();

    let availableWords = wordPool.filter((word) => !usedWords.has(word.word));

    // Filter by difficulty if in difficulty mode
    if (mode === 'difficulty' && selectedDifficulty) {
      availableWords = availableWords.filter((word) => word.difficulty === selectedDifficulty);
    }

    // If all words have been used, reset
    if (availableWords.length === 0) {
      set({ usedWords: new Set() });
      availableWords = wordPool;

      if (mode === 'difficulty' && selectedDifficulty) {
        availableWords = availableWords.filter((word) => word.difficulty === selectedDifficulty);
      }
    }

    // Return random word
    if (availableWords.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  },
}));
