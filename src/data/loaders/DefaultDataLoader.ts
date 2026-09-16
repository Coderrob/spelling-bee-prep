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

import { DictionaryService } from '@/services/dictionary/DictionaryService';
import { BundledDictionaryLoader } from '@/services/dictionary/loaders/BundledDictionaryLoader';
import type { WordEntry } from '@/types';
import { GradeLevel, LocaleCode } from '@/types';

/**
 * Default word set for initial implementation
 * In production, this would load from JSON files
 */
const defaultRepository = new DictionaryService(new BundledDictionaryLoader(), LocaleCode.EN_US);

/** @deprecated Load grade-specific words through the dictionary repository. */
export async function loadDefaultWords(): Promise<WordEntry[]> {
  return defaultRepository.getWords(GradeLevel.THIRD);
}
