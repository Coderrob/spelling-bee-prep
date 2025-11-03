/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { create } from 'zustand';
import {
  type PracticeAttempt,
  PracticeMode,
  type PracticeStatistics,
  type WordEntry,
  type Difficulty,
  HintType,
} from '@/types';
import {
  appendPracticeAttempt,
  loadPracticeHistory,
  MAX_HISTORY_ENTRIES,
} from '@/utils/storage/practiceHistory';

/** Defines the shape of the practice session state. */
interface PracticeState extends PracticeStatistics {
  currentWord: WordEntry | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  hintType: HintType | null;
  mode: PracticeMode;
  selectedDifficulties: Difficulty[];
  wordPool: WordEntry[];
  usedWords: Set<string>;
  history: PracticeAttempt[];
}

/** Defines the actions available to manipulate the practice session state. */
interface PracticeActions {
  setCurrentWord: (word: WordEntry | null) => void;
  setUserInput: (input: string) => void;
  checkAnswer: () => void;
  nextWord: () => void;
  toggleHint: (hintType?: HintType) => void;
  setMode: (mode: PracticeMode) => void;
  setDifficulties: (difficulties: Difficulty[]) => void;
  setWordPool: (words: WordEntry[]) => void;
  resetSession: () => void;
  getRandomWord: () => WordEntry | null;
}

/** Combined type representing the full practice store. */
type PracticeStore = PracticeState & PracticeActions;

/** Default values for practice statistics. */
const statisticsDefaults: PracticeStatistics = {
  wordsAttempted: 0,
  wordsCorrect: 0,
  wordsIncorrect: 0,
  currentStreak: 0,
  maxStreak: 0,
  accuracy: 0,
};

/**
 * Creates the initial store snapshot with default statistics and history.
 *
 * @returns A fresh {@link PracticeState} populated with defaults and persisted history
 */
function createInitialState(): PracticeState {
  return {
    ...statisticsDefaults,
    currentWord: null,
    userInput: '',
    isCorrect: null,
    showHint: false,
    hintType: null,
    mode: PracticeMode.RANDOM,
    selectedDifficulties: [],
    wordPool: [],
    usedWords: new Set(),
    history: loadPracticeHistory(),
  };
}

/**
 * Global Zustand store providing practice session state, helpers, and statistics.
 */
export const usePracticeStore = create<PracticeStore>((set, get) => ({
  ...createInitialState(),

  /**
   * Loads the supplied word and resets answer state.
   *
   * @param word - Word to display as current
   */
  setCurrentWord: (word) =>
    set({
      currentWord: word,
      userInput: '',
      isCorrect: null,
      showHint: false,
      hintType: null,
    }),

  /**
   * Updates the user input without mutating other state.
   *
   * @param input - User's latest answer attempt
   */
  setUserInput: (input) => set({ userInput: input }),

  /**
   * Evaluates the current answer, updates statistics, and records history.
   */
  checkAnswer: () => {
    const state = get();
    if (!state.currentWord) {
      return;
    }

    const isCorrect = isAnswerCorrect(state.userInput, state.currentWord.word);
    updateStatistics(set, get, isCorrect);
    markWordAsUsed(set, get, state.currentWord.word);
    recordPracticeAttempt(set, {
      word: state.currentWord.word,
      correct: isCorrect,
      difficulty: state.currentWord.difficulty,
      timestamp: Date.now(),
    });
  },

  /**
   * Advances to another word using the current filtering rules.
   */
  nextWord: () => {
    const word = get().getRandomWord();
    get().setCurrentWord(word);
  },

  /**
   * Toggles hint visibility or sets an explicit hint type.
   *
   * @param hintType - Optional hint type to force on
   */
  toggleHint: (hintType) => {
    const state = get();
    if (hintType) {
      set({ showHint: true, hintType });
    } else {
      set({
        showHint: !state.showHint,
        hintType: state.showHint ? null : (state.hintType ?? HintType.DEFINITION),
      });
    }
  },

  /**
   * Switches the practice mode and clears the used word list.
   *
   * @param mode - Practice mode to activate
   */
  setMode: (mode) => set({ mode, usedWords: new Set() }),

  /**
   * Applies difficulty filters, resetting used words and invalidating the current word when required.
   *
   * @param difficulties - Ordered collection of allowed difficulty levels
   */
  setDifficulties: (difficulties) => {
    set((state) => applyDifficultyFilter(state, difficulties));
  },

  /**
   * Replaces the active word pool and clears tracking of used words.
   *
   * @param words - New pool of words to practice
   */
  setWordPool: (words) => set({ wordPool: words, usedWords: new Set() }),

  /**
   * Restores the store to its initial state while preserving the active word pool.
   */
  resetSession: () =>
    set((state) => ({
      ...state,
      ...statisticsDefaults,
      currentWord: null,
      userInput: '',
      isCorrect: null,
      showHint: false,
      hintType: null,
      usedWords: new Set(),
    })),

  /**
   * Returns a random word that respects the current filters and usage tracking.
   *
   * @returns Randomly selected word or `null` when none are available
   */
  getRandomWord: () => {
    const state = get();
    const { word, usedWords } = selectNextWord(state);

    if (usedWords !== state.usedWords) {
      set({ usedWords });
    }

    return word;
  },
}));

/**
 * Determines whether the supplied user input exactly matches the expected word.
 *
 * @param userInput - User provided answer
 * @param correctWord - Word the learner was expected to spell
 * @returns `true` when the answer matches ignoring casing and whitespace
 */
function isAnswerCorrect(userInput: string, correctWord: string): boolean {
  return userInput.toLowerCase().trim() === correctWord.toLowerCase();
}

/**
 * Updates aggregate statistics based on the result of an attempt.
 *
 * @param set - Zustand setter
 * @param _get - Zustand getter (unused)
 * @param isCorrect - Flag indicating whether the attempt was correct
 */
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

/**
 * Persists a practice attempt to local storage and the in-memory history.
 *
 * @param set - Zustand setter
 * @param attempt - Attempt metadata to record
 */
function recordPracticeAttempt(
  set: (fn: (state: PracticeStore) => Partial<PracticeStore>) => void,
  attempt: PracticeAttempt
): void {
  const persistedHistory = appendPracticeAttempt(attempt);

  set((state) => {
    const historyFromStorage =
      persistedHistory.length > 0
        ? persistedHistory
        : [...state.history, attempt].slice(-MAX_HISTORY_ENTRIES);

    return { history: historyFromStorage };
  });
}

/**
 * Calculates the learner's accuracy percentage.
 *
 * @param correct - Number of correct attempts
 * @param attempted - Total attempts
 * @returns Accuracy percentage from 0 to 100
 */
function calculateAccuracy(correct: number, attempted: number): number {
  return attempted === 0 ? 0 : (correct / attempted) * 100;
}

/**
 * Marks a word as used so it is not repeated until the pool cycles.
 *
 * @param set - Zustand setter
 * @param _get - Zustand getter (unused)
 * @param word - Word to mark as used
 */
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

/**
 * Applies difficulty filter updates and selects a new word if needed.
 *
 * @param state - Current practice state
 * @param difficulties - New difficulty filters to apply
 * @returns Updated state with new difficulty filters and word if needed
 */
function applyDifficultyFilter(
  state: PracticeState,
  difficulties: Difficulty[]
): Partial<PracticeStore> {
  const baseState: PracticeState = {
    ...state,
    selectedDifficulties: difficulties,
    usedWords: new Set(),
  };

  if (shouldKeepCurrentWord(state, difficulties)) {
    return {
      selectedDifficulties: difficulties,
      usedWords: baseState.usedWords,
    };
  }

  const { word, usedWords } = selectNextWord(baseState);

  return {
    selectedDifficulties: difficulties,
    usedWords,
    currentWord: word,
  };
}

/**
 * Determines if the current word should be kept with new difficulty filters.
 *
 * @param state - Current practice state
 * @param difficulties - New difficulty filters
 * @returns True if current word matches new filters
 */
function shouldKeepCurrentWord(state: PracticeState, difficulties: Difficulty[]): boolean {
  if (!state.currentWord) {
    return false;
  }

  if (difficulties.length === 0) {
    return true;
  }

  return difficulties.includes(state.currentWord.difficulty);
}

/**
 * Filters the word pool by usage and active difficulty filters.
 *
 * @param state - Current practice state
 * @returns Array of words that can be surfaced to the learner
 */
function getAvailableWords(state: PracticeState): WordEntry[] {
  const words = state.wordPool.filter((word) => !state.usedWords.has(word.word));

  if (shouldFilterByDifficulty(state)) {
    return filterByDifficulty(words, state.selectedDifficulties);
  }

  return words;
}

/**
 * Determines whether the active difficulty filters should be applied.
 *
 * @param state - Current practice state
 * @returns `true` if at least one difficulty is selected
 */
function shouldFilterByDifficulty(state: PracticeState): boolean {
  return state.selectedDifficulties.length > 0;
}

/**
 * Returns only words that match the allowed difficulty levels.
 *
 * @param words - Candidate words
 * @param difficulties - Allowed difficulty levels
 * @returns Filtered word array honouring the difficulty selection
 */
function filterByDifficulty(words: WordEntry[], difficulties: Difficulty[]): WordEntry[] {
  if (difficulties.length === 0) {
    return words;
  }

  const allowed = new Set(difficulties);
  return words.filter((word) => allowed.has(word.difficulty));
}

/**
 * Indicates whether all words have been consumed under the current filters.
 *
 * @param words - Filtered word list
 * @returns `true` when no words remain
 */
function isPoolExhausted(words: WordEntry[]): boolean {
  return words.length === 0;
}

/**
 * Selects the next eligible word and handles pool resets when exhausted.
 *
 * @param state - Current practice state snapshot
 * @returns Tuple containing the chosen word and the updated used-word set
 */
function selectNextWord(state: PracticeState): { word: WordEntry | null; usedWords: Set<string> } {
  const availableWords = getAvailableWords(state);

  if (isPoolExhausted(availableWords)) {
    return selectWordAfterReset(state);
  }

  return { word: getRandomFromPool(availableWords, state), usedWords: state.usedWords };
}

/**
 * Resets the used words pool and selects a random word from the full pool.
 *
 * @param state - Current practice state snapshot
 * @returns Tuple containing the chosen word and the empty used-word set
 */
function selectWordAfterReset(state: PracticeState): {
  word: WordEntry | null;
  usedWords: Set<string>;
} {
  const resetUsedWords = new Set<string>();
  const resetState: PracticeState = { ...state, usedWords: resetUsedWords };
  const nextWord = getRandomFromPool(state.wordPool, resetState);
  return { word: nextWord, usedWords: resetUsedWords };
}

/**
 * Returns a random word from the supplied list while respecting active difficulty filters.
 *
 * @param words - Candidate words
 * @param state - Current practice state for additional filtering
 * @returns Randomly selected word or `null` if none are available
 */
function getRandomFromPool(words: WordEntry[], state: PracticeState): WordEntry | null {
  let filteredWords = words;

  if (shouldFilterByDifficulty(state)) {
    filteredWords = filterByDifficulty(words, state.selectedDifficulties);
  }

  if (filteredWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}
