import type { WordMastery } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const RETRY_DELAY_MS = 10 * 60 * 1000;
const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;

/** Advances or resets one word's Leitner-style review schedule. */
export function updateWordMastery(
  previous: WordMastery | undefined,
  wordId: string,
  correct: boolean,
  now: number
): WordMastery {
  const current = previous ?? newMastery(wordId, now);
  return correct ? promoteMastery(current, now) : resetMastery(current, now);
}

function newMastery(wordId: string, now: number): WordMastery {
  return {
    wordId,
    stage: 0,
    attempts: 0,
    correctAttempts: 0,
    correctStreak: 0,
    lastSeenAt: now,
    dueAt: now,
  };
}

function promoteMastery(current: WordMastery, now: number): WordMastery {
  const stage = Math.min(current.stage + 1, REVIEW_INTERVAL_DAYS.length - 1);
  return {
    ...current,
    stage,
    attempts: current.attempts + 1,
    correctAttempts: current.correctAttempts + 1,
    correctStreak: current.correctStreak + 1,
    lastSeenAt: now,
    dueAt: now + REVIEW_INTERVAL_DAYS[stage] * DAY_MS,
  };
}

function resetMastery(current: WordMastery, now: number): WordMastery {
  return {
    ...current,
    stage: 0,
    attempts: current.attempts + 1,
    correctStreak: 0,
    lastSeenAt: now,
    dueAt: now + RETRY_DELAY_MS,
  };
}

/** Returns true when a word has never been seen or its review date has arrived. */
export function isWordDue(mastery: WordMastery | undefined, now: number): boolean {
  return !mastery || mastery.dueAt <= now;
}
