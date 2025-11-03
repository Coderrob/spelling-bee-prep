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
