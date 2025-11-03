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
 * TTS configuration options
 */
export interface TtsOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}
