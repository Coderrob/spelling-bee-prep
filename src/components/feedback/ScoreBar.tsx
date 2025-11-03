import { Paper, Stack } from '@mui/material';
import type { PracticeStatistics } from '@/types';
import type { ReactElement } from 'react';
import { Stat } from './Stat';

/** Props for the ScoreBar component. */
interface ScoreBarProps {
  statistics: PracticeStatistics;
}

/**
 * Displays top-line practice statistics in a responsive row.
 *
 * @param props - Component props
 * @param props.statistics - Aggregated practice statistics to render
 * @returns Material UI paper summarizing current performance
 * @example
 * ```tsx
 * <ScoreBar statistics={practiceStatistics} />
 * ```
 */
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
