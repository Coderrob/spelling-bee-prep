import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { Difficulty } from '@/types';
import type { ReactElement } from 'react';

interface CorrectnessChipProps {
  difficulty: Difficulty;
}

type ChipColor = NonNullable<ChipProps['color']>;

enum DifficultyColorMap {
  EASY = 'success',
  MEDIUM = 'warning',
  HARD = 'error',
}

function getDifficultyColor(difficulty: Difficulty): ChipColor {
  const colorMap: Record<Difficulty, ChipColor> = {
    [Difficulty.EASY]: DifficultyColorMap.EASY as ChipColor,
    [Difficulty.MEDIUM]: DifficultyColorMap.MEDIUM as ChipColor,
    [Difficulty.HARD]: DifficultyColorMap.HARD as ChipColor,
  };
  return colorMap[difficulty];
}

export function CorrectnessChip({ difficulty }: Readonly<CorrectnessChipProps>): ReactElement {
  return <Chip label={difficulty.toUpperCase()} color={getDifficultyColor(difficulty)} />;
}
