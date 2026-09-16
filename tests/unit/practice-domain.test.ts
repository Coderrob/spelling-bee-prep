import { describe, expect, it } from 'vitest';
import { updateWordMastery } from '../../src/domain/practice/masteryPolicy';
import {
  AdaptiveReviewStrategy,
  ChallengeSelectionStrategy,
  RandomSelectionStrategy,
} from '../../src/domain/practice/selectionStrategies';
import { initialSessionState, transitionSession } from '../../src/domain/practice/sessionMachine';
import {
  Difficulty,
  GradeLevel,
  HintType,
  PracticeSessionStatus,
  type WordEntry,
} from '../../src/types';

const words: WordEntry[] = [
  {
    id: 'easy',
    word: 'cat',
    gradeLevel: GradeLevel.FIRST,
    difficulty: Difficulty.EASY,
    definition: 'A pet',
    sourceId: 'test',
  },
  {
    id: 'hard',
    word: 'friend',
    gradeLevel: GradeLevel.FIRST,
    difficulty: Difficulty.HARD,
    definition: 'A companion',
    sourceId: 'test',
  },
];

describe('practice domain', () => {
  it('moves through explicit session states', () => {
    const presenting = transitionSession(initialSessionState, {
      type: 'PRESENT_WORD',
      word: words[0],
      now: 100,
    });
    const withHint = transitionSession(presenting, {
      type: 'SHOW_HINT',
      hintType: HintType.DEFINITION,
    });
    const answered = transitionSession(withHint, { type: 'ANSWER', correct: true });

    expect(presenting.status).toBe(PracticeSessionStatus.PRESENTING);
    expect(withHint.hintsUsed).toBe(1);
    expect(answered.status).toBe(PracticeSessionStatus.ANSWERED);
  });

  it('advances and resets spaced-review mastery', () => {
    const learned = updateWordMastery(undefined, 'easy', true, 1_000);
    const missed = updateWordMastery(learned, 'easy', false, 2_000);

    expect(learned.stage).toBe(1);
    expect(learned.dueAt).toBeGreaterThan(1_000);
    expect(missed.stage).toBe(0);
    expect(missed.correctStreak).toBe(0);
  });

  it('supports random, challenge, and adaptive strategies', () => {
    const context = {
      candidates: words,
      mastery: {
        easy: {
          wordId: 'easy',
          stage: 3,
          attempts: 3,
          correctAttempts: 3,
          correctStreak: 3,
          lastSeenAt: 900,
          dueAt: 2_000,
        },
      },
      now: 1_000,
      random: () => 0,
    };
    expect(new RandomSelectionStrategy().select(context)?.id).toBe('easy');
    expect(new ChallengeSelectionStrategy().select(context)?.id).toBe('hard');
    expect(new AdaptiveReviewStrategy().select(context)?.id).toBe('hard');
  });
});
