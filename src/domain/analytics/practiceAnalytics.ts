import { Difficulty, type PracticeAttempt } from '@/types';

export interface TrendPoint {
  label: string;
  correct: number;
  incorrect: number;
}

export interface NamedCount {
  name: string;
  value: number;
}

export interface MissedWord {
  word: string;
  count: number;
}

export interface PracticeAnalytics {
  trend: TrendPoint[];
  difficulty: NamedCount[];
  topMisses: MissedWord[];
}

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'Easy',
  [Difficulty.MEDIUM]: 'Medium',
  [Difficulty.HARD]: 'Hard',
};

/** Produces a stable, UI-independent analytics view model from attempt events. */
export function buildPracticeAnalytics(history: PracticeAttempt[]): PracticeAnalytics {
  const sorted = [...history].sort((left, right) => left.timestamp - right.timestamp);
  const difficultyCounts: Record<Difficulty, number> = {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0,
  };
  const missCounts = new Map<string, number>();
  let correct = 0;
  let incorrect = 0;

  const trend = sorted.map((attempt, index) => {
    correct += attempt.correct ? 1 : 0;
    incorrect += attempt.correct ? 0 : 1;
    difficultyCounts[attempt.difficulty] += 1;
    if (!attempt.correct) {
      missCounts.set(attempt.word, (missCounts.get(attempt.word) ?? 0) + 1);
    }
    return { label: `Attempt ${index + 1}`, correct, incorrect };
  });

  const difficulty = Object.entries(difficultyCounts)
    .filter((entry) => entry[1] > 0)
    .map(([difficultyLevel, value]) => ({
      name: difficultyLabels[difficultyLevel as Difficulty],
      value,
    }));

  const topMisses = Array.from(missCounts, ([word, count]) => ({ word, count }))
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word))
    .slice(0, 10);

  return { trend, difficulty, topMisses };
}
