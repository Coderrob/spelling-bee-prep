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
        return currentWord.usageExample || '';
      case HintType.ORIGIN:
        return currentWord.origin || '';
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
