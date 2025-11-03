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

/**
 * Checks if the code is running in a browser environment
 * @returns true if window is defined
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Checks if the browser supports Web Speech API
 * @returns true if speechSynthesis is available
 */
export function hasWebSpeechSupport(): boolean {
  return isBrowser() && 'speechSynthesis' in window;
}

/**
 * Checks if the browser supports Web Audio API
 * @returns true if AudioContext is available
 */
export function hasAudioContextSupport(): boolean {
  return isBrowser() && 'AudioContext' in window;
}

/**
 * Checks if the browser supports WebAssembly
 * @returns true if WebAssembly is available
 */
export function hasWebAssemblySupport(): boolean {
  return isBrowser() && 'WebAssembly' in window;
}

/**
 * Checks if the browser supports Fetch API
 * @returns true if fetch is available
 */
export function hasFetchSupport(): boolean {
  return isBrowser() && 'fetch' in window;
}

/**
 * Gets an error message from an unknown error value
 * @param error - The error value to extract message from
 * @param defaultMessage - Default message if error is not an Error instance
 * @returns The error message
 */
export function getErrorMessage(error: unknown, defaultMessage = 'Unknown error'): string {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Wraps an error with a custom message prefix
 * @param error - The original error
 * @param prefix - The message prefix
 * @returns A new Error with the prefixed message
 */
export function wrapError(error: unknown, prefix: string): Error {
  const message = getErrorMessage(error);
  return new Error(`${prefix}: ${message}`);
}
