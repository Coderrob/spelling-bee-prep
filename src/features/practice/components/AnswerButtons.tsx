import type { ReactElement } from 'react';
import { Stack, Button } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { HintType } from '@/types';

/**
 * Props for the AnswerButtons component.
 */
interface AnswerButtonsProps {
  onHint: (hintType: HintType) => void;
  isSubmitDisabled: boolean;
}

/**
 * Component rendering the hint and submit buttons for practice answers.
 *
 * @param onHint - Callback function to request a hint.
 * @param isSubmitDisabled - Indicates if the submit button should be disabled.
 * @returns A React element representing the answer buttons.
 * @example
 * <AnswerButtons
 *   onHint={handleHintRequest}
 *   isSubmitDisabled={isSubmitDisabled}
 * />
 */
export function AnswerButtons({
  onHint,
  isSubmitDisabled,
}: Readonly<AnswerButtonsProps>): ReactElement {
  const { t } = useTranslation();

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
      <Button
        variant="outlined"
        startIcon={<Lightbulb />}
        onClick={() => onHint(HintType.DEFINITION)}
        fullWidth
      >
        {t('practice.hint')}
      </Button>
      <Button type="submit" variant="contained" fullWidth disabled={isSubmitDisabled}>
        {t('practice.submit')}
      </Button>
    </Stack>
  );
}
