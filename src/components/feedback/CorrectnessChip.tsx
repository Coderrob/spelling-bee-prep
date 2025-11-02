import { Chip } from '@mui/material';
import { Difficulty } from '@/types';

interface CorrectnessChipProps {
  difficulty: Difficulty;
}

enum DifficultyColor {
  EASY = 'success',
  MEDIUM = 'warning',
  HARD = 'error',
}

function getDifficultyColor(difficulty: Difficulty): 'success' | 'warning' | 'error' {
  switch (difficulty) {
    case Difficulty.EASY:
      return DifficultyColor.EASY as 'success';
    case Difficulty.MEDIUM:
      return DifficultyColor.MEDIUM as 'warning';
    case Difficulty.HARD:
      return DifficultyColor.HARD as 'error';
  }
}

export function CorrectnessChip({ difficulty }: CorrectnessChipProps) {
  return <Chip label={difficulty.toUpperCase()} color={getDifficultyColor(difficulty)} />;
}
