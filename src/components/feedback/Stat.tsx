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
import { Stack, Typography } from '@mui/material';

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
        sx={{ fontWeight: 600, color: color ?? 'text.primary' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
