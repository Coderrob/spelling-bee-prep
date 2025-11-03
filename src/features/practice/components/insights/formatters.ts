import { Difficulty } from '@/types';

/**
 * Converts a difficulty enum value into a human-friendly label with sentence casing.
 *
 * @param difficulty - Difficulty to format
 * @returns Capitalized difficulty label
 *
 * @example
 * ```ts
 * formatDifficultyLabel(Difficulty.MEDIUM); // => "Medium"
 * ```
 */
export function formatDifficultyLabel(difficulty: Difficulty): string {
  const [first, ...rest] = difficulty.split('');
  return [first.toUpperCase(), ...rest].join('');
}
