import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { EChartsOption } from 'echarts';
import { InsightChart } from './InsightChart';

interface InsightCardProps {
  title: string;
  subtitle: string;
  option: EChartsOption;
  ariaLabel: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  height?: number;
}

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
