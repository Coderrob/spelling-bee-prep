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
import { Stack, Button } from '@mui/material';
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
