import { describe, expect, it } from 'vitest';
import { buildPracticeAnalytics } from '../../src/domain/analytics/practiceAnalytics';
import { Difficulty, type PracticeAttempt } from '../../src/types';

describe('practice analytics', () => {
  it('builds chronological trends, difficulty totals, and ranked misses', () => {
    const attempts: PracticeAttempt[] = [
      { word: 'ship', correct: false, difficulty: Difficulty.EASY, timestamp: 20 },
      { word: 'tree', correct: true, difficulty: Difficulty.MEDIUM, timestamp: 10 },
      { word: 'ship', correct: false, difficulty: Difficulty.EASY, timestamp: 30 },
    ];

    const result = buildPracticeAnalytics(attempts);

    expect(result.trend).toEqual([
      { label: 'Attempt 1', correct: 1, incorrect: 0 },
      { label: 'Attempt 2', correct: 1, incorrect: 1 },
      { label: 'Attempt 3', correct: 1, incorrect: 2 },
    ]);
    expect(result.difficulty).toEqual([
      { name: 'Easy', value: 2 },
      { name: 'Medium', value: 1 },
    ]);
    expect(result.topMisses).toEqual([{ word: 'ship', count: 2 }]);
  });
});
