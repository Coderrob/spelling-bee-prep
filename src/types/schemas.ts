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

import { z } from 'zod';
import { Difficulty, GradeLevel, LocaleCode } from './enums';

const enumValues = <T extends Record<string, string>>(
  value: T
): [T[keyof T], ...Array<T[keyof T]>] => Object.values(value) as [T[keyof T], ...Array<T[keyof T]>];

/** Zod schema for curriculum source attribution. */
export const CatalogSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  license: z.string().min(1),
  url: z.url().optional(),
});

/**
 * Zod schema for validating WordEntry objects
 */
export const WordEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  word: z.string().trim().min(1).max(100),
  gradeLevel: z.enum(enumValues(GradeLevel)),
  difficulty: z.enum(enumValues(Difficulty)),
  definition: z.string().trim().min(1),
  usageExample: z.string().optional(),
  origin: z.string().optional(),
  phonetic: z.string().optional(),
  category: z.string().optional(),
  partOfSpeech: z.string().optional(),
  syllableCount: z.number().int().positive().optional(),
  spellingPatterns: z.array(z.string().min(1)).optional(),
  sourceId: z.string().min(1),
});

/**
 * Zod schema for validating WordSet objects
 */
export const WordSetSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    words: z.array(WordEntrySchema).min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    language: z.enum(enumValues(LocaleCode)),
    gradeLevel: z.enum(enumValues(GradeLevel)),
    sources: z.array(CatalogSourceSchema).min(1),
  })
  .superRefine((wordSet, context) => {
    const ids = new Set<string>();
    const spellings = new Set<string>();
    const sourceIds = new Set(wordSet.sources.map((source) => source.id));

    wordSet.words.forEach((entry, index) => {
      const normalizedWord = entry.word.toLocaleLowerCase();
      if (entry.gradeLevel !== wordSet.gradeLevel) {
        context.addIssue({
          code: 'custom',
          path: ['words', index, 'gradeLevel'],
          message: 'Word grade must match its word set',
        });
      }
      if (ids.has(entry.id)) {
        context.addIssue({
          code: 'custom',
          path: ['words', index, 'id'],
          message: `Duplicate word id: ${entry.id}`,
        });
      }
      if (spellings.has(normalizedWord)) {
        context.addIssue({
          code: 'custom',
          path: ['words', index, 'word'],
          message: `Duplicate spelling: ${entry.word}`,
        });
      }
      if (!sourceIds.has(entry.sourceId)) {
        context.addIssue({
          code: 'custom',
          path: ['words', index, 'sourceId'],
          message: `Unknown source: ${entry.sourceId}`,
        });
      }
      if (entry.usageExample?.toLocaleLowerCase().includes(normalizedWord)) {
        context.addIssue({
          code: 'custom',
          path: ['words', index, 'usageExample'],
          message: 'Usage examples must not reveal the spelling word',
        });
      }
      ids.add(entry.id);
      spellings.add(normalizedWord);
    });
  });

/** Runtime schema for backward-compatible attempt history. */
export const PracticeAttemptSchema = z.object({
  wordId: z.string().optional(),
  word: z.string().min(1),
  correct: z.boolean(),
  difficulty: z.enum(enumValues(Difficulty)),
  gradeLevel: z.enum(enumValues(GradeLevel)).optional(),
  responseTimeMs: z.number().nonnegative().optional(),
  hintsUsed: z.number().int().nonnegative().optional(),
  timestamp: z.number().nonnegative(),
});

/** Runtime schema for the learner's spaced-review record. */
export const WordMasterySchema = z.object({
  wordId: z.string().min(1),
  stage: z.number().int().min(0).max(5),
  attempts: z.number().int().nonnegative(),
  correctAttempts: z.number().int().nonnegative(),
  correctStreak: z.number().int().nonnegative(),
  lastSeenAt: z.number().nonnegative(),
  dueAt: z.number().nonnegative(),
});

/** Versioned persistence schema for attempts and mastery. */
export const ProgressSnapshotSchema = z.object({
  version: z.literal(1),
  attempts: z.array(PracticeAttemptSchema),
  mastery: z.record(z.string(), WordMasterySchema),
});

/**
 * Inferred types from schemas
 */
export type WordEntrySchemaType = z.infer<typeof WordEntrySchema>;
export type WordSetSchemaType = z.infer<typeof WordSetSchema>;
