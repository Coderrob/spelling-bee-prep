import { Difficulty, PracticeMode, type WordEntry, type WordMastery } from '@/types';
import { isWordDue } from './masteryPolicy';

export interface SelectionContext {
  candidates: WordEntry[];
  mastery: Readonly<Partial<Record<string, WordMastery>>>;
  now: number;
  random: () => number;
}

/** Strategy boundary for choosing the next eligible curriculum word. */
export interface WordSelectionStrategy {
  select(context: SelectionContext): WordEntry | null;
}

export class RandomSelectionStrategy implements WordSelectionStrategy {
  select({ candidates, random }: SelectionContext): WordEntry | null {
    return randomItem(candidates, random);
  }
}

export class ChallengeSelectionStrategy implements WordSelectionStrategy {
  select({ candidates, mastery, random }: SelectionContext): WordEntry | null {
    const difficultyScore = { [Difficulty.EASY]: 1, [Difficulty.MEDIUM]: 2, [Difficulty.HARD]: 3 };
    const ranked = [...candidates].sort((left, right) => {
      const difficultyDelta = difficultyScore[right.difficulty] - difficultyScore[left.difficulty];
      if (difficultyDelta !== 0) {
        return difficultyDelta;
      }
      return (mastery[left.id]?.stage ?? 0) - (mastery[right.id]?.stage ?? 0);
    });
    const challengePool = ranked.slice(0, Math.max(1, Math.ceil(ranked.length / 4)));
    return randomItem(challengePool, random);
  }
}

export class AdaptiveReviewStrategy implements WordSelectionStrategy {
  select({ candidates, mastery, now, random }: SelectionContext): WordEntry | null {
    const due = candidates.filter((word) => isWordDue(mastery[word.id], now));
    const pool = due.length > 0 ? due : candidates;
    const lowestStage = Math.min(...pool.map((word) => mastery[word.id]?.stage ?? 0));
    return randomItem(
      pool.filter((word) => (mastery[word.id]?.stage ?? 0) === lowestStage),
      random
    );
  }
}

/** Resolves a practice mode to its word-selection policy. */
export function createSelectionStrategy(mode: PracticeMode): WordSelectionStrategy {
  switch (mode) {
    case PracticeMode.CHALLENGES:
      return new ChallengeSelectionStrategy();
    case PracticeMode.ADAPTIVE:
      return new AdaptiveReviewStrategy();
    case PracticeMode.DIFFICULTY:
    case PracticeMode.RANDOM:
      return new RandomSelectionStrategy();
  }
}

function randomItem(words: WordEntry[], random: () => number): WordEntry | null {
  if (words.length === 0) {
    return null;
  }
  return words[Math.floor(random() * words.length)] ?? null;
}
