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
import { Difficulty, LocaleCode } from './enums';

/**
 * Zod schema for validating WordEntry objects
 */
export const WordEntrySchema = z.object({
  word: z.string().min(1),
  difficulty: z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]),
  definition: z.string(),
  usageExample: z.string().optional(),
  origin: z.string().optional(),
  phonetic: z.string().optional(),
  category: z.string().optional(),
});

/**
 * Zod schema for validating WordSet objects
 */
export const WordSetSchema = z.object({
  name: z.string(),
  description: z.string(),
  words: z.array(WordEntrySchema),
  version: z.string(),
  language: z.enum([LocaleCode.EN_US, LocaleCode.ES_ES, LocaleCode.FR_FR]),
});

/**
 * Inferred types from schemas
 */
export type WordEntrySchemaType = z.infer<typeof WordEntrySchema>;
export type WordSetSchemaType = z.infer<typeof WordSetSchema>;
