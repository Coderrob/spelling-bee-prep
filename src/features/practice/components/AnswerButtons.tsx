import type { ReactElement } from 'react';
import { Stack, Button } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { HintType } from '@/types';

interface AnswerButtonsProps {
  onHint: (hintType: HintType) => void;
  isSubmitDisabled: boolean;
}

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
