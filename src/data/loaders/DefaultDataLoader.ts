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

import type { WordEntry } from '@/types';
import { Difficulty } from '@/types';

/**
 * Default word set for initial implementation
 * In production, this would load from JSON files
 */
export const DEFAULT_WORDS: WordEntry[] = [
  {
    word: 'apple',
    difficulty: Difficulty.EASY,
    definition: 'A round fruit with red, green, or yellow skin',
    usageExample: 'I ate a red apple for lunch.',
    category: 'food',
  },
  {
    word: 'book',
    difficulty: Difficulty.EASY,
    definition: 'A set of printed or written pages bound together',
    usageExample: 'She read an interesting book about history.',
    category: 'education',
  },
  {
    word: 'chair',
    difficulty: Difficulty.EASY,
    definition: 'A piece of furniture for sitting',
    usageExample: 'Please sit on the chair.',
    category: 'furniture',
  },
  {
    word: 'bicycle',
    difficulty: Difficulty.MEDIUM,
    definition: 'A two-wheeled vehicle powered by pedaling',
    usageExample: 'He rode his bicycle to school.',
    category: 'transportation',
  },
  {
    word: 'beautiful',
    difficulty: Difficulty.MEDIUM,
    definition: 'Pleasing to the senses or mind',
    usageExample: 'The sunset was beautiful.',
    category: 'adjective',
  },
  {
    word: 'accommodate',
    difficulty: Difficulty.HARD,
    definition: 'To provide lodging or to adjust to',
    usageExample: 'The hotel can accommodate 500 guests.',
    origin: 'From Latin accommodare',
    category: 'verb',
  },
  {
    word: 'conscience',
    difficulty: Difficulty.HARD,
    definition: "A person's moral sense of right and wrong",
    usageExample: 'His conscience troubled him about the lie.',
    origin: 'From Latin conscientia',
    category: 'noun',
  },
];
