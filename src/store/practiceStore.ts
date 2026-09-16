import { create } from 'zustand';
import { isWordDue } from '@/domain/practice/masteryPolicy';
import { createSelectionStrategy } from '@/domain/practice/selectionStrategies';
import {
  initialSessionState,
  transitionSession,
  type SessionEvent,
  type SessionMachineState,
} from '@/domain/practice/sessionMachine';
import {
  HintType,
  PracticeMode,
  PracticeSessionStatus,
  type PracticeAttempt,
  type PracticeStatistics,
  type Difficulty,
  type WordEntry,
} from '@/types';
import { useProgressStore } from './progressStore';

interface PracticeState extends PracticeStatistics, SessionMachineState {
  mode: PracticeMode;
  selectedDifficulties: Difficulty[];
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
  setDifficulties: (difficulties: Difficulty[]) => void;
  setWordPool: (words: WordEntry[]) => void;
  resetSession: () => void;
  getRandomWord: () => WordEntry | null;
}

type PracticeStore = PracticeState & PracticeActions;

const statisticsDefaults: PracticeStatistics = {
  wordsAttempted: 0,
  wordsCorrect: 0,
  wordsIncorrect: 0,
  currentStreak: 0,
  maxStreak: 0,
  accuracy: 0,
};

function createInitialState(): PracticeState {
  return {
    ...statisticsDefaults,
    ...initialSessionState,
    mode: PracticeMode.RANDOM,
    selectedDifficulties: [],
    wordPool: [],
    usedWords: new Set(),
  };
}

/** Session store that delegates lifecycle and selection rules to pure domain policies. */
export const usePracticeStore = create<PracticeStore>((set, get) => ({
  ...createInitialState(),

  setCurrentWord: (word) => {
    set((state) => transitionSession(state, { type: 'PRESENT_WORD', word, now: Date.now() }));
  },

  setUserInput: (input) => {
    dispatchSessionEvent(set, { type: 'CHANGE_INPUT', input });
  },

  checkAnswer: () => {
    const state = get();
    if (!state.currentWord || state.status !== PracticeSessionStatus.PRESENTING) {
      return;
    }

    const currentWord = state.currentWord;
    const timestamp = Date.now();
    const correct = isAnswerCorrect(state.userInput, currentWord.word);
    const attempt: PracticeAttempt = {
      wordId: currentWord.id,
      word: currentWord.word,
      correct,
      difficulty: currentWord.difficulty,
      gradeLevel: currentWord.gradeLevel,
      responseTimeMs: state.startedAt ? timestamp - state.startedAt : undefined,
      hintsUsed: state.hintsUsed,
      timestamp,
    };

    set((current) => ({
      ...transitionSession(current, { type: 'ANSWER', correct }),
      ...nextStatistics(current, correct),
      usedWords: new Set(current.usedWords).add(currentWord.id),
    }));
    useProgressStore.getState().recordAttempt(attempt);
  },

  nextWord: () => {
    const word = get().getRandomWord();
    get().setCurrentWord(word);
  },

  toggleHint: (hintType) => {
    const state = get();
    const event: SessionEvent = state.showHint
      ? { type: 'HIDE_HINT' }
      : { type: 'SHOW_HINT', hintType: hintType ?? state.hintType ?? HintType.DEFINITION };
    dispatchSessionEvent(set, event);
  },

  setMode: (mode) => set({ mode, usedWords: new Set() }),

  setDifficulties: (difficulties) => {
    set((state) => applyDifficultyChange(state, difficulties));
  },

  setWordPool: (words) =>
    set({
      ...initialSessionState,
      wordPool: words,
      usedWords: new Set(),
    }),

  resetSession: () =>
    set({
      ...statisticsDefaults,
      ...initialSessionState,
      usedWords: new Set(),
    }),

  getRandomWord: () => {
    const state = get();
    const result = selectWord(state);
    if (result.usedWords !== state.usedWords) {
      set({ usedWords: result.usedWords });
    }
    return result.word;
  },
}));

function dispatchSessionEvent(
  set: (updater: (state: PracticeStore) => Partial<PracticeStore>) => void,
  event: SessionEvent
): void {
  set((state) => transitionSession(state, event));
}

function isAnswerCorrect(userInput: string, correctWord: string): boolean {
  return userInput.toLocaleLowerCase().trim() === correctWord.toLocaleLowerCase();
}

function nextStatistics(state: PracticeState, correct: boolean): PracticeStatistics {
  const wordsAttempted = state.wordsAttempted + 1;
  const wordsCorrect = state.wordsCorrect + (correct ? 1 : 0);
  const wordsIncorrect = state.wordsIncorrect + (correct ? 0 : 1);
  const currentStreak = correct ? state.currentStreak + 1 : 0;
  return {
    wordsAttempted,
    wordsCorrect,
    wordsIncorrect,
    currentStreak,
    maxStreak: Math.max(state.maxStreak, currentStreak),
    accuracy: (wordsCorrect / wordsAttempted) * 100,
  };
}

function applyDifficultyChange(
  state: PracticeState,
  difficulties: Difficulty[]
): Partial<PracticeState> {
  const base = { ...state, selectedDifficulties: difficulties, usedWords: new Set<string>() };
  if (
    state.currentWord &&
    (difficulties.length === 0 || difficulties.includes(state.currentWord.difficulty))
  ) {
    return { selectedDifficulties: difficulties, usedWords: base.usedWords };
  }

  const result = selectWord(base);
  return {
    selectedDifficulties: difficulties,
    usedWords: result.usedWords,
    ...transitionSession(state, { type: 'PRESENT_WORD', word: result.word, now: Date.now() }),
  };
}

function selectWord(state: PracticeState): { word: WordEntry | null; usedWords: Set<string> } {
  const filtered = filterByDifficulty(state.wordPool, state.selectedDifficulties);
  const mastery = useProgressStore.getState().mastery;
  const now = Date.now();
  let usedWords = state.usedWords;
  let candidates = filtered.filter((word) => !usedWords.has(word.id));

  if (state.mode === PracticeMode.ADAPTIVE) {
    const dueWords = filtered.filter((word) => isWordDue(mastery[word.id], now));
    if (dueWords.length > 0) {
      candidates = dueWords;
    }
  }

  if (candidates.length === 0 && filtered.length > 0) {
    usedWords = new Set();
    candidates = filtered;
  }

  const strategy = createSelectionStrategy(state.mode);
  const word = strategy.select({
    candidates,
    mastery,
    now,
    random: Math.random,
  });
  return { word, usedWords };
}

function filterByDifficulty(words: WordEntry[], difficulties: Difficulty[]): WordEntry[] {
  if (difficulties.length === 0) {
    return words;
  }
  const allowed = new Set(difficulties);
  return words.filter((word) => allowed.has(word.difficulty));
}
