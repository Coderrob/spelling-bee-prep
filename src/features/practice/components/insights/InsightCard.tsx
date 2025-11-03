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
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { InsightChart } from './InsightChart';
import type { EChartsOption } from 'echarts';

/** Props for the InsightCard component. */
interface InsightCardProps {
  title: string;
  subtitle: string;
  option: EChartsOption;
  ariaLabel: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  height?: number;
}

/**
 * Card wrapper that renders an insight chart or an empty message when data is unavailable.
 *
 * @param props - Component props
 * @returns Card element ready for dashboard grids
 * @example
 * ```tsx
 * <InsightCard
 *   title="Practice Trends"
 *   subtitle="Your performance over time"
 *   option={chartOption}
 *   ariaLabel="Line chart showing practice trends"
 * />
 * ```
 */
export function InsightCard({
  title,
  subtitle,
  option,
  ariaLabel,
  emptyMessage = 'No data available yet.',
  isEmpty = false,
  height = 320,
}: Readonly<InsightCardProps>): ReactElement {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <Typography component="h3" variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {isEmpty ? (
          <Typography color="text.secondary">{emptyMessage}</Typography>
        ) : (
          <InsightChart option={option} ariaLabel={ariaLabel} height={height} />
        )}
      </CardContent>
    </Card>
  );
}
