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

import type { ReactElement } from 'react';
import { Lightbulb } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { HintType, type WordEntry } from '@/types';

/**
 * Props for the HintDisplay component.
 */
interface HintDisplayProps {
  hintType: HintType;
  currentWord: WordEntry;
}

/**
 * Component to display a hint for the current word.
 *
 * @param hintType - The type of hint to display.
 * @param currentWord - The word entry for which the hint is provided.
 * @returns A React element representing the hint display.
 * @example
 * <HintDisplay
 *   hintType={HintType.DEFINITION}
 *   currentWord={{ word: 'example', definition: 'a representative form or pattern' }}
 * />
 */
export function HintDisplay({ hintType, currentWord }: Readonly<HintDisplayProps>): ReactElement {
  const { t } = useTranslation();

  function maskSpellingWord(value: string): string {
    const escapedWord = currentWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return value.replace(new RegExp(`\\b${escapedWord}\\b`, 'gi'), '___');
  }

  /**
   * Retrieves the content of the hint based on its type.
   *
   * @returns The hint content as a string.
   */
  function getHintContent(): string {
    switch (hintType) {
      case HintType.DEFINITION:
        return maskSpellingWord(currentWord.definition);
      case HintType.USAGE_EXAMPLE:
        return currentWord.usageExample ?? '';
      case HintType.ORIGIN:
        return currentWord.origin ?? '';
      default:
        return '';
    }
  }

  return (
    <aside className="hint-card" aria-label={`${t(`practice.hints.${hintType}`)} hint`}>
      <span className="hint-card__icon">
        <Lightbulb fontSize="small" aria-hidden="true" />
      </span>
      <div className="hint-card__content">
        <p className="hint-card__label">{t(`practice.hints.${hintType}`)}</p>
        <p className="hint-card__text">{getHintContent()}</p>
      </div>
    </aside>
  );
}
