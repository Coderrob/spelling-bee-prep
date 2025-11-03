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
import { Alert, Typography } from '@mui/material';
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

  /**
   * Retrieves the content of the hint based on its type.
   *
   * @returns The hint content as a string.
   */
  function getHintContent(): string {
    switch (hintType) {
      case HintType.DEFINITION:
        return currentWord.definition;
      case HintType.USAGE_EXAMPLE:
        return currentWord.usageExample ?? '';
      case HintType.ORIGIN:
        return currentWord.origin ?? '';
      default:
        return '';
    }
  }

  return (
    <Alert severity="info">
      <Typography variant="subtitle2" fontWeight="bold">
        {t(`practice.hints.${hintType}`)}:
      </Typography>
      <Typography>{getHintContent()}</Typography>
    </Alert>
  );
}
