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
