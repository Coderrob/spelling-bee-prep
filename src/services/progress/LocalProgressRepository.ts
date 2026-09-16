import type { IProgressRepository, ProgressSnapshot } from '@/types';
import { ProgressSnapshotSchema } from '@/types';
import { isBrowser } from '@/utils/common';
import { clearPracticeHistory, loadPracticeHistory } from '@/utils/storage/practiceHistory';

const STORAGE_KEY = 'spelling-bee:progress:v1';

const emptySnapshot = (): ProgressSnapshot => ({ version: 1, attempts: [], mastery: {} });

/** Browser-local adapter for versioned learner progress. */
export class LocalProgressRepository implements IProgressRepository {
  load(): ProgressSnapshot {
    const storage = this.getStorage();
    if (!storage) {
      return emptySnapshot();
    }

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...emptySnapshot(), attempts: loadPracticeHistory() };
      }
      const result = ProgressSnapshotSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : emptySnapshot();
    } catch (error) {
      console.warn('Unable to load learner progress:', error);
      return emptySnapshot();
    }
  }

  save(snapshot: ProgressSnapshot): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn('Unable to save learner progress:', error);
    }
  }

  clear(): void {
    const storage = this.getStorage();
    storage?.removeItem(STORAGE_KEY);
    clearPracticeHistory();
  }

  private getStorage(): Storage | null {
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
}
