import type { PracticeAttempt } from '@/types';
import { isBoolean, isNumber, isObject, isString } from '@/utils/guards';
import { isBrowser } from '@/utils/common';

const STORAGE_KEY = 'spelling-bee:practice-history';
export const MAX_HISTORY_ENTRIES = 1000;

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

export function clearPracticeHistory(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
}

function persistHistory(history: PracticeAttempt[], storage: Storage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Unable to persist practice history:', error);
  }
}

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
