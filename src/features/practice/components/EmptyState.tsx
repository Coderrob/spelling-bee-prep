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
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  onStart: () => void;
}

/**
 * Component displayed when there are no words to practice.
 *
 * @param onStart - Callback function to initiate the practice session.
 * @returns A React element representing the empty state.
 * @example
 * <EmptyState onStart={handleStartPractice} />
 */
export function EmptyState({ onStart }: Readonly<EmptyStateProps>): ReactElement {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t('practice.title')}
        </Typography>
        <Button variant="contained" onClick={onStart} fullWidth>
          {t('practice.startPractice')}
        </Button>
      </CardContent>
    </Card>
  );
}
