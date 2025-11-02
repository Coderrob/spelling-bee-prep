import { Chip, Stack } from '@mui/material';
import type { PracticeStatistics } from '@/types';

interface ScoreBarProps {
  statistics: PracticeStatistics;
}

export function ScoreBar({ statistics }: ScoreBarProps) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
      <Chip label={`Attempted: ${statistics.wordsAttempted}`} color="primary" />
      <Chip label={`✓ ${statistics.wordsCorrect}`} color="success" />
      <Chip label={`🔥 Streak: ${statistics.currentStreak}`} color="warning" />
    </Stack>
  );
}
