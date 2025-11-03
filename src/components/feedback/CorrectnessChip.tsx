import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { Difficulty } from '@/types';
import type { ReactElement } from 'react';

/** Props for the CorrectnessChip component. */
interface CorrectnessChipProps {
  difficulty: Difficulty;
}

/** Type representing valid chip colors. */
type ChipColor = NonNullable<ChipProps['color']>;

/** Maps difficulty levels to corresponding chip colors. */
enum DifficultyColorMap {
  EASY = 'success',
  MEDIUM = 'warning',
  HARD = 'error',
}

/**
 * Maps difficulty levels to corresponding chip colors.
 *
 * @param difficulty - The difficulty level
 * @returns The corresponding ChipColor
 */
function getDifficultyColor(difficulty: Difficulty): ChipColor {
  const colorMap: Record<Difficulty, ChipColor> = {
    [Difficulty.EASY]: DifficultyColorMap.EASY,
    [Difficulty.MEDIUM]: DifficultyColorMap.MEDIUM,
    [Difficulty.HARD]: DifficultyColorMap.HARD,
  };
  return colorMap[difficulty];
}

/**
 * Renders a chip indicating the difficulty level.
 *
 * @param difficulty - The difficulty level to display
 * @returns A React element representing the correctness chip
 * @example
 * <CorrectnessChip difficulty={Difficulty.EASY} />
 */
export function CorrectnessChip({ difficulty }: Readonly<CorrectnessChipProps>): ReactElement {
  return <Chip label={difficulty.toUpperCase()} color={getDifficultyColor(difficulty)} />;
}
