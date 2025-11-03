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

import type { Difficulty, GradeBand, LocaleCode } from './enums';

/**
 * Represents a single word entry in the dictionary
 */
export interface WordEntry {
  word: string;
  difficulty: Difficulty;
  definition: string;
  usageExample?: string;
  origin?: string;
  phonetic?: string;
  category?: string;
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
  gradeBand?: GradeBand;
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
  word: string;
  correct: boolean;
  difficulty: Difficulty;
  timestamp: number;
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
