/**
 * Common utility functions for repetitive operations
 * Reduces cognitive load by providing named operations
 */

/**
 * Checks if the code is running in a browser environment
 * @returns true if window is defined
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
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
