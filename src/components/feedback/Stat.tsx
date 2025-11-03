import { Stack, Typography } from '@mui/material';
import type { ReactElement } from 'react';

/**
 * Props for the Stat component.
 */
interface StatProps {
  label: string;
  value: number | string;
  color?: string;
}

/**
 * Renders a single statistic composed of a label and value.
 *
 * @param props - Component props
 * @param props.label - Statistic label
 * @param props.value - Statistic value
 * @param props.color - Optional override color for the value
 * @returns Stack with caption and value typography
 */
export function Stat({ label, value, color }: Readonly<StatProps>): ReactElement {
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
