import { PracticeSessionStatus, type HintType, type WordEntry } from '@/types';

/** State governed by the pure practice-session transition function. */
export interface SessionMachineState {
  status: PracticeSessionStatus;
  currentWord: WordEntry | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  hintType: HintType | null;
  startedAt: number | null;
  hintsUsed: number;
}

export type SessionEvent =
  | { type: 'PRESENT_WORD'; word: WordEntry | null; now: number }
  | { type: 'CHANGE_INPUT'; input: string }
  | { type: 'SHOW_HINT'; hintType: HintType }
  | { type: 'HIDE_HINT' }
  | { type: 'ANSWER'; correct: boolean }
  | { type: 'RESET' };

export const initialSessionState: SessionMachineState = {
  status: PracticeSessionStatus.IDLE,
  currentWord: null,
  userInput: '',
  isCorrect: null,
  showHint: false,
  hintType: null,
  startedAt: null,
  hintsUsed: 0,
};

/** Performs one deterministic session lifecycle transition. */
export function transitionSession(
  state: SessionMachineState,
  event: SessionEvent
): SessionMachineState {
  return transitionHandlers[event.type](state, event);
}

type TransitionHandler = (state: SessionMachineState, event: SessionEvent) => SessionMachineState;

const transitionHandlers: Record<SessionEvent['type'], TransitionHandler> = {
  PRESENT_WORD: (state, event) => {
    if (event.type !== 'PRESENT_WORD') return state;
    return {
      ...initialSessionState,
      status: event.word ? PracticeSessionStatus.PRESENTING : PracticeSessionStatus.EXHAUSTED,
      currentWord: event.word,
      startedAt: event.word ? event.now : null,
    };
  },
  CHANGE_INPUT: (state, event) => {
    if (event.type !== 'CHANGE_INPUT' || state.status !== PracticeSessionStatus.PRESENTING) {
      return state;
    }
    return { ...state, userInput: event.input };
  },
  SHOW_HINT: (state, event) => {
    if (event.type !== 'SHOW_HINT' || state.status !== PracticeSessionStatus.PRESENTING) {
      return state;
    }
    return {
      ...state,
      showHint: true,
      hintType: event.hintType,
      hintsUsed: state.hintsUsed + (state.showHint ? 0 : 1),
    };
  },
  HIDE_HINT: (state) => ({ ...state, showHint: false, hintType: null }),
  ANSWER: (state, event) => {
    if (event.type !== 'ANSWER' || state.status !== PracticeSessionStatus.PRESENTING) {
      return state;
    }
    return { ...state, status: PracticeSessionStatus.ANSWERED, isCorrect: event.correct };
  },
  RESET: () => initialSessionState,
};
