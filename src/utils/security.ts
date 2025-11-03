import { MAX_INPUT_LENGTH } from '@/types/constants';

/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates input length to prevent DoS attacks
 * @param input - The user input string
 * @param maxLength - Maximum allowed length
 * @returns True if input length is valid, false otherwise
 */
export function validateInputLength(input: string, maxLength = MAX_INPUT_LENGTH): boolean {
  return input.length <= maxLength;
}

/**
 * Validates that input contains only allowed characters (letters, spaces, hyphens)
 * @param input - The user input string
 * @returns True if input is valid, false otherwise
 */
export function validateCharset(input: string): boolean {
  const allowedPattern = /^[a-zA-Z\s-]+$/;
  return allowedPattern.test(input);
}

/**
 * Sanitizes user input
 * @param input - The user input string
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
  if (!validateInputLength(input)) {
    return input.substring(0, MAX_INPUT_LENGTH);
  }
  return input.trim();
}
