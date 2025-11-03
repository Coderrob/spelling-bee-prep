import type { ReactElement, Ref } from 'react';
import { Alert, Button, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
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
