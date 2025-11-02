import { normalize } from '@/utils/strings';

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Compares two words with normalization and accent handling
 */
export function compareWords(word1: string, word2: string): boolean {
  const normalized1 = normalize(word1);
  const normalized2 = normalize(word2);
  return normalized1 === normalized2;
}

/**
 * Checks if answer is close enough (within threshold)
 */
export function isCloseMatch(answer: string, correct: string, threshold = 2): boolean {
  const distance = levenshteinDistance(normalize(answer), normalize(correct));
  return distance <= threshold;
}
