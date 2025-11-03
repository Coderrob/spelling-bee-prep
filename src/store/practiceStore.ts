import { create } from 'zustand';
import type { WordEntry, PracticeStatistics } from '@/types';
import { PracticeMode, Difficulty, HintType } from '@/types';
import { isDefined } from '@/utils/guards';

interface PracticeState extends PracticeStatistics {
  currentWord: WordEntry | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  hintType: HintType | null;
  mode: PracticeMode;
  selectedDifficulty: Difficulty | null;
  wordPool: WordEntry[];
  usedWords: Set<string>;
}

interface PracticeActions {
  setCurrentWord: (word: WordEntry | null) => void;
  setUserInput: (input: string) => void;
  checkAnswer: () => void;
  nextWord: () => void;
  toggleHint: (hintType?: HintType) => void;
  setMode: (mode: PracticeMode) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setWordPool: (words: WordEntry[]) => void;
  resetSession: () => void;
  getRandomWord: () => WordEntry | null;
}

type PracticeStore = PracticeState & PracticeActions;

const initialState: PracticeState = {
  currentWord: null,
  userInput: '',
  isCorrect: null,
  showHint: false,
  hintType: null,
  mode: PracticeMode.RANDOM,
  selectedDifficulty: null,
  wordsAttempted: 0,
  wordsCorrect: 0,
  wordsIncorrect: 0,
  currentStreak: 0,
  maxStreak: 0,
  accuracy: 0,
  wordPool: [],
  usedWords: new Set(),
};

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  ...initialState,

  setCurrentWord: (word) =>
    set({
      currentWord: word,
      userInput: '',
      isCorrect: null,
      showHint: false,
      hintType: null,
    }),

  setUserInput: (input) => set({ userInput: input }),

  checkAnswer: () => {
    const state = get();
    if (!state.currentWord) return;

    const isCorrect = isAnswerCorrect(state.userInput, state.currentWord.word);
    updateStatistics(set, get, isCorrect);
    markWordAsUsed(set, get, state.currentWord.word);
  },

  nextWord: () => {
    const word = get().getRandomWord();
    get().setCurrentWord(word);
  },

  toggleHint: (hintType) => {
    const state = get();
    if (hintType) {
      set({ showHint: true, hintType });
    } else {
      set({
        showHint: !state.showHint,
        hintType: state.showHint ? null : state.hintType || HintType.DEFINITION,
      });
    }
  },

  setMode: (mode) => set({ mode, usedWords: new Set() }),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty, usedWords: new Set() }),

  setWordPool: (words) => set({ wordPool: words, usedWords: new Set() }),

  resetSession: () => set({ ...initialState, wordPool: get().wordPool }),

  getRandomWord: () => {
    const state = get();
    const availableWords = getAvailableWords(state);

    if (isPoolExhausted(availableWords)) {
      resetUsedWords(set);
      return getRandomFromPool(state.wordPool, state);
    }

    return getRandomFromPool(availableWords, state);
  },
}));

function isAnswerCorrect(userInput: string, correctWord: string): boolean {
  return userInput.toLowerCase().trim() === correctWord.toLowerCase();
}

function updateStatistics(
  set: (fn: (state: PracticeStore) => Partial<PracticeStore>) => void,
  _get: () => PracticeStore,
  isCorrect: boolean
): void {
  set((state) => {
    const newStreak = isCorrect ? state.currentStreak + 1 : 0;
    const newAttempted = state.wordsAttempted + 1;
    const newCorrect = state.wordsCorrect + (isCorrect ? 1 : 0);
    const newIncorrect = state.wordsIncorrect + (isCorrect ? 0 : 1);

    return {
      isCorrect,
      wordsAttempted: newAttempted,
      wordsCorrect: newCorrect,
      wordsIncorrect: newIncorrect,
      currentStreak: newStreak,
      maxStreak: Math.max(state.maxStreak, newStreak),
      accuracy: calculateAccuracy(newCorrect, newAttempted),
    };
  });
}

function calculateAccuracy(correct: number, attempted: number): number {
  return attempted === 0 ? 0 : (correct / attempted) * 100;
}

function markWordAsUsed(
  set: (fn: (state: PracticeStore) => Partial<PracticeStore>) => void,
  _get: () => PracticeStore,
  word: string
): void {
  set((state) => {
    const newUsedWords = new Set(state.usedWords);
    newUsedWords.add(word);
    return { usedWords: newUsedWords };
  });
}

function getAvailableWords(state: PracticeState): WordEntry[] {
  let words = state.wordPool.filter((word) => !state.usedWords.has(word.word));

  if (shouldFilterByDifficulty(state)) {
    words = filterByDifficulty(words, state.selectedDifficulty!);
  }

  return words;
}

function shouldFilterByDifficulty(state: PracticeState): boolean {
  return state.mode === PracticeMode.DIFFICULTY && isDefined(state.selectedDifficulty);
}

function filterByDifficulty(words: WordEntry[], difficulty: Difficulty): WordEntry[] {
  return words.filter((word) => word.difficulty === difficulty);
}

function isPoolExhausted(words: WordEntry[]): boolean {
  return words.length === 0;
}

function resetUsedWords(set: (fn: (state: PracticeStore) => Partial<PracticeStore>) => void): void {
  set(() => ({ usedWords: new Set() }));
}

function getRandomFromPool(words: WordEntry[], state: PracticeState): WordEntry | null {
  let filteredWords = words;

  if (shouldFilterByDifficulty(state)) {
    filteredWords = filterByDifficulty(words, state.selectedDifficulty!);
  }

  if (filteredWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}
