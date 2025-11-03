import { MAX_INPUT_LENGTH } from '@/types/constants';

/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates input length to prevent DoS attacks
 */
export function validateInputLength(input: string, maxLength = MAX_INPUT_LENGTH): boolean {
  return input.length <= maxLength;
}

/**
 * Validates that input contains only allowed characters (letters, spaces, hyphens)
 */
export function validateCharset(input: string): boolean {
  const allowedPattern = /^[a-zA-Z\s-]+$/;
  return allowedPattern.test(input);
}

/**
 * Sanitizes user input
 */
export function sanitizeInput(input: string): string {
  if (!validateInputLength(input)) {
    return input.substring(0, MAX_INPUT_LENGTH);
  }
  return input.trim();
}
