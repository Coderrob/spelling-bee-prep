import type { ReactElement } from 'react';
import { Box, Button } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { HintType } from '@/types';

interface AnswerButtonsProps {
  onHint: (hintType: HintType) => void;
  isSubmitDisabled: boolean;
}

export function AnswerButtons({ onHint, isSubmitDisabled }: AnswerButtonsProps): ReactElement {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
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
    </Box>
  );
}
