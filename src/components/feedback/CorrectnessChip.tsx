import { Chip } from '@mui/material';
import type { Difficulty } from '@/types';

interface CorrectnessChipProps {
  difficulty: Difficulty;
}

export function CorrectnessChip({ difficulty }: CorrectnessChipProps) {
  const colorMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  } as const;

  return <Chip label={difficulty.toUpperCase()} color={colorMap[difficulty]} />;
}
