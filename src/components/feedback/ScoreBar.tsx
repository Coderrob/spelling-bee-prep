import { Paper, Stack, Typography } from '@mui/material';
import type { PracticeStatistics } from '@/types';
import type { ReactElement } from 'react';

interface ScoreBarProps {
  statistics: PracticeStatistics;
}

export function ScoreBar({ statistics }: Readonly<ScoreBarProps>): ReactElement {
  return (
    <Paper
      elevation={2}
      role="region"
      aria-label="Practice statistics summary"
      sx={{
        px: 2.5,
        py: 2,
        borderRadius: 2,
        backdropFilter: 'blur(6px)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.5, sm: 3 }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Stat label="Attempted" value={statistics.wordsAttempted} />
        <Stat label="Correct" value={statistics.wordsCorrect} color="success.main" />
        <Stat label="Incorrect" value={statistics.wordsIncorrect} color="error.main" />
        <Stat label="Accuracy" value={`${Math.round(statistics.accuracy)}%`} />
        <Stat label="Current streak" value={statistics.currentStreak} />
      </Stack>
    </Paper>
  );
}

interface StatProps {
  label: string;
  value: number | string;
  color?: string;
}

function Stat({ label, value, color }: Readonly<StatProps>): ReactElement {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h6"
        component="p"
        sx={{ fontWeight: 600, color: color || 'text.primary' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
