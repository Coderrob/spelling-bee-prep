import { Chip } from '@mui/material';
import { Difficulty } from '@/types';
import type { ReactElement } from 'react';

interface CorrectnessChipProps {
  difficulty: Difficulty;
}

enum DifficultyColor {
  EASY = 'success',
  MEDIUM = 'warning',
  HARD = 'error',
}

function getDifficultyColor(difficulty: Difficulty): DifficultyColor {
  switch (difficulty) {
    case Difficulty.EASY:
      return DifficultyColor.EASY;
    case Difficulty.MEDIUM:
      return DifficultyColor.MEDIUM;
    case Difficulty.HARD:
      return DifficultyColor.HARD;
  }
}

export function CorrectnessChip({ difficulty }: CorrectnessChipProps): ReactElement {
  return (
    <Chip
      label={difficulty.toUpperCase()}
      color={getDifficultyColor(difficulty) as 'success' | 'warning' | 'error'}
    />
  );
}
