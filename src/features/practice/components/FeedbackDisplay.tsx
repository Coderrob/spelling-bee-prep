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

import type { ReactElement, Ref } from 'react';
import { NavigateNext } from '@mui/icons-material';
import { Alert, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WordEntry } from '@/types';

/**
 * Props for the FeedbackDisplay component.
 */
interface FeedbackDisplayProps {
  isCorrect: boolean;
  currentWord: WordEntry;
  onNext: () => void;
  nextButtonRef?: Ref<HTMLButtonElement>;
}

/**
 * Component to display feedback after a practice attempt.
 *
 * @param isCorrect - Indicates if the user's answer was correct.
 * @param currentWord - The word entry that was just practiced.
 * @param onNext - Callback function to proceed to the next word.
 * @param nextButtonRef - Optional ref for the "Next Word" button.
 * @returns A React element representing the feedback display.
 * @example
 * <FeedbackDisplay
 *   isCorrect={true}
 *   currentWord={{ word: 'example', definition: 'a representative form or pattern' }}
 *   onNext={handleNextWord}
 * />
 */
export function FeedbackDisplay({
  isCorrect,
  currentWord,
  onNext,
  nextButtonRef,
}: Readonly<FeedbackDisplayProps>): ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <Alert severity={isCorrect ? 'success' : 'error'}>
        <Typography variant="h6">
          {isCorrect ? t('practice.correct') : t('practice.incorrect')}
        </Typography>
        <Typography>
          The word is: <strong>{currentWord.word}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {currentWord.definition}
        </Typography>
      </Alert>
      <Button
        variant="contained"
        startIcon={<NavigateNext />}
        onClick={onNext}
        fullWidth
        ref={nextButtonRef}
      >
        {t('practice.nextWord')}
      </Button>
    </>
  );
}
