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

import type { Difficulty, GradeBand, GradeLevel, LocaleCode } from './enums';

/** Describes the origin and reuse terms for curriculum content. */
export interface CatalogSource {
  id: string;
  name: string;
  license: string;
  url?: string;
}

/**
 * Represents a single word entry in the dictionary
 */
export interface WordEntry {
  id: string;
  word: string;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  definition: string;
  usageExample?: string;
  origin?: string;
  phonetic?: string;
  category?: string;
  partOfSpeech?: string;
  syllableCount?: number;
  spellingPatterns?: string[];
  sourceId: string;
  /** @deprecated Use gradeLevel for curriculum selection. */
  gradeBand?: GradeBand;
}

/**
 * Collection of words with metadata
 */
export interface WordSet {
  name: string;
  description: string;
  words: WordEntry[];
  version: string;
  language: LocaleCode;
  gradeLevel: GradeLevel;
  sources: CatalogSource[];
}

/**
 * Practice session statistics
 */
export interface PracticeStatistics {
  wordsAttempted: number;
  wordsCorrect: number;
  wordsIncorrect: number;
  currentStreak: number;
  maxStreak: number;
  accuracy: number;
}

/**
 * Captures a single practice attempt for historical insights
 */
export interface PracticeAttempt {
  wordId?: string;
  word: string;
  correct: boolean;
  difficulty: Difficulty;
  gradeLevel?: GradeLevel;
  responseTimeMs?: number;
  hintsUsed?: number;
  timestamp: number;
}

/** Persisted spaced-review state for one curriculum word. */
export interface WordMastery {
  wordId: string;
  stage: number;
  attempts: number;
  correctAttempts: number;
  correctStreak: number;
  lastSeenAt: number;
  dueAt: number;
}

/** Versioned learner data persisted independently from a practice session. */
export interface ProgressSnapshot {
  version: 1;
  attempts: PracticeAttempt[];
  mastery: Record<string, WordMastery>;
}

/**
 * TTS configuration options
 */
export interface TtsOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}
