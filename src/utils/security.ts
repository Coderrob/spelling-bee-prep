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

import { MAX_INPUT_LENGTH } from '@/types/constants';

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
