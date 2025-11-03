import type { ReactElement } from 'react';
import { Alert, Button, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { WordEntry } from '@/types';

interface FeedbackDisplayProps {
  isCorrect: boolean;
  currentWord: WordEntry;
  onNext: () => void;
}

export function FeedbackDisplay({
  isCorrect,
  currentWord,
  onNext,
}: FeedbackDisplayProps): ReactElement {
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
      <Button variant="contained" startIcon={<NavigateNext />} onClick={onNext} fullWidth>
        {t('practice.nextWord')}
      </Button>
    </>
  );
}
