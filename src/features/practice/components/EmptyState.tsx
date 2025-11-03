import type { ReactElement } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  onStart: () => void;
}

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
