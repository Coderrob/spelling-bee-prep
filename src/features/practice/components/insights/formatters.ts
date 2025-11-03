import { Difficulty } from '@/types';

export function formatDifficultyLabel(difficulty: Difficulty): string {
  const [first, ...rest] = difficulty.split('');
  return [first.toUpperCase(), ...rest].join('');
}
