/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ReactElement } from 'react';
import { Chip } from '@mui/material';
import { Difficulty } from '@/types';
import type { ChipProps } from '@mui/material';

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
