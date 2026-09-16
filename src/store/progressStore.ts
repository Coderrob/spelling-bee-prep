import { create } from 'zustand';
import { updateWordMastery } from '@/domain/practice/masteryPolicy';
import { LocalProgressRepository } from '@/services/progress/LocalProgressRepository';
import type { PracticeAttempt, ProgressSnapshot, WordMastery } from '@/types';

const MAX_ATTEMPTS = 1000;
const repository = new LocalProgressRepository();

interface ProgressState {
  attempts: PracticeAttempt[];
  mastery: Record<string, WordMastery>;
}

interface ProgressActions {
  recordAttempt: (attempt: PracticeAttempt) => void;
  clearProgress: () => void;
}

type ProgressStore = ProgressState & ProgressActions;

function initialProgress(): ProgressState {
  const snapshot = repository.load();
  return { attempts: snapshot.attempts, mastery: snapshot.mastery };
}

function persist(state: ProgressState): void {
  const snapshot: ProgressSnapshot = {
    version: 1,
    attempts: state.attempts,
    mastery: state.mastery,
  };
  repository.save(snapshot);
}

/** Focused store for durable attempt history and spaced-review mastery. */
export const useProgressStore = create<ProgressStore>((set) => ({
  ...initialProgress(),
  recordAttempt: (attempt) =>
    set((state) => {
      const attempts = [...state.attempts, attempt].slice(-MAX_ATTEMPTS);
      const mastery = attempt.wordId
        ? {
            ...state.mastery,
            [attempt.wordId]: updateWordMastery(
              state.mastery[attempt.wordId],
              attempt.wordId,
              attempt.correct,
              attempt.timestamp
            ),
          }
        : state.mastery;
      const nextState = { attempts, mastery };
      persist(nextState);
      return nextState;
    }),
  clearProgress: () => {
    repository.clear();
    set({ attempts: [], mastery: {} });
  },
}));
