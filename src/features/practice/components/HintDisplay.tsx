import type { ReactElement } from 'react';
import { Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HintType, type WordEntry } from '@/types';

interface HintDisplayProps {
  hintType: HintType;
  currentWord: WordEntry;
}

export function HintDisplay({ hintType, currentWord }: HintDisplayProps): ReactElement {
  const { t } = useTranslation();

  const getHintContent = (): string => {
    switch (hintType) {
      case HintType.DEFINITION:
        return currentWord.definition;
      case HintType.USAGE_EXAMPLE:
        return currentWord.usageExample || '';
      case HintType.ORIGIN:
        return currentWord.origin || '';
      default:
        return '';
    }
  };

  return (
    <Alert severity="info">
      <Typography variant="subtitle2" fontWeight="bold">
        {t(`practice.hints.${hintType}`)}:
      </Typography>
      <Typography>{getHintContent()}</Typography>
    </Alert>
  );
}
