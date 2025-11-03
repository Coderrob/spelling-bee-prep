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

import type { PracticeAttempt } from '@/types';
import { isBrowser } from '@/utils/common';
import { isBoolean, isNumber, isObject, isString } from '@/utils/guards';

const STORAGE_KEY = 'spelling-bee:practice-history';
export const MAX_HISTORY_ENTRIES = 1000;

/**
 * Loads all persisted practice attempts from local storage.
 *
 * @returns Ordered list of practice attempts or an empty array when unavailable
 */
export function loadPracticeHistory(): PracticeAttempt[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const attempts = parsed as unknown[];
    return attempts.filter(isValidAttempt);
  } catch (error) {
    console.warn('Unable to load practice history from storage:', error);
    return [];
  }
}

/**
 * Appends a new attempt to the persisted history and returns the updated list.
 *
 * @param attempt - Attempt metadata to store
 * @returns Trimmed list of attempts capped at {@link MAX_HISTORY_ENTRIES}
 */
export function appendPracticeAttempt(attempt: PracticeAttempt): PracticeAttempt[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const history = [...loadPracticeHistory(), attempt];
  const trimmed = history.slice(-MAX_HISTORY_ENTRIES);
  persistHistory(trimmed, storage);
  return trimmed;
}

/**
 * Removes all stored practice history from local storage.
 */
export function clearPracticeHistory(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
}

/**
 * Persists practice history to storage while handling quota or availability failures gracefully.
 *
 * @param history - Attempts to persist
 * @param storage - Storage instance to update
 */
function persistHistory(history: PracticeAttempt[], storage: Storage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Unable to persist practice history:', error);
  }
}

/**
 * Runtime guard verifying an object conforms to {@link PracticeAttempt}.
 *
 * @param candidate - Unknown value to validate
 * @returns `true` when the candidate represents a valid practice attempt
 */
function isValidAttempt(candidate: unknown): candidate is PracticeAttempt {
  if (!isObject(candidate)) {
    return false;
  }

  const attempt = candidate as Record<string, unknown>;

  return (
    isString(attempt.word) &&
    isBoolean(attempt.correct) &&
    isString(attempt.difficulty) &&
    isNumber(attempt.timestamp)
  );
}

/**
 * Returns the browser storage instance when available.
 *
 * @returns Local storage instance or `null` when inaccessible
 */
function getStorage(): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch (error) {
    console.warn('Local storage is unavailable:', error);
    return null;
  }
}
