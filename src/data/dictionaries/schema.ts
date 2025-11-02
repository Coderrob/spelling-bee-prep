import { z } from 'zod';

export const WordSchema = z.object({
  word: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  definition: z.string(),
  usageExample: z.string().optional(),
  origin: z.string().optional(),
  phonetic: z.string().optional(),
  category: z.string().optional(),
});

export const WordSetSchema = z.object({
  name: z.string(),
  description: z.string(),
  words: z.array(WordSchema),
  version: z.string(),
  language: z.string().default('en-US'),
});

export type Word = z.infer<typeof WordSchema>;
export type WordSet = z.infer<typeof WordSetSchema>;

// Validate word set data
export function validateWordSet(data: unknown): WordSet {
  return WordSetSchema.parse(data);
}
