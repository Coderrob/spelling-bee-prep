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

import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { PracticeAttempt } from '@/types';
import { Difficulty } from '@/types';
import { typedEntries } from '@/utils/collections/typedEntries';
import { InsightCard, formatDifficultyLabel } from './insights';
import type { EChartsOption } from 'echarts';

/**
 * Props for the PracticeInsights component.
 */
interface PracticeInsightsProps {
  history: PracticeAttempt[];
}

/**
 * Displays analytical charts summarizing recent spelling attempts.
 *
 * @param props - Component props
 * @param props.history - Ordered list of practice attempts to visualize
 * @returns Stack of insight cards or `null` when no history exists
 *
 * @example
 * ```tsx
 * <PracticeInsights history={practiceHistory} />
 * ```
 */
export function PracticeInsights({
  history,
}: Readonly<PracticeInsightsProps>): ReactElement | null {
  const hasHistory = history.length > 0;

  /** Sorted practice history by timestamp ascending. */
  const sortedHistory = useMemo(() => {
    if (!hasHistory) {
      return [];
    }

    return [...history].sort((a, b) => a.timestamp - b.timestamp);
  }, [hasHistory, history]);

  /** ECharts option for the trend line chart. */
  const trendOption = useMemo<EChartsOption>(() => {
    const attempts = sortedHistory.map((_attempt, index) => `Attempt ${index + 1}`);

    const correctSeries: number[] = [];
    const incorrectSeries: number[] = [];
    let correct = 0;
    let incorrect = 0;

    for (const attempt of sortedHistory) {
      correct += attempt.correct ? 1 : 0;
      incorrect += attempt.correct ? 0 : 1;
      correctSeries.push(correct);
      incorrectSeries.push(incorrect);
    }

    return {
      color: ['#2ecc71', '#e74c3c'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Correct', 'Incorrect'],
      },
      grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: attempts,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Correct',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: correctSeries,
        },
        {
          name: 'Incorrect',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: incorrectSeries,
        },
      ],
    };
  }, [sortedHistory]);

  /** Summary of attempts grouped by difficulty level. */
  const difficultySummary = useMemo(() => {
    const counts: Record<Difficulty, number> = {
      [Difficulty.EASY]: 0,
      [Difficulty.MEDIUM]: 0,
      [Difficulty.HARD]: 0,
    };

    for (const attempt of sortedHistory) {
      counts[attempt.difficulty] += 1;
    }

    return typedEntries(counts)
      .filter(([, value]) => value > 0)
      .map(([difficulty, value]) => ({
        name: formatDifficultyLabel(difficulty),
        value,
      }));
  }, [sortedHistory]);

  /** ECharts option for the difficulty doughnut chart. */
  const difficultyOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      series: [
        {
          name: 'Attempts',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          data: difficultySummary,
          avoidLabelOverlap: false,
          label: {
            formatter: '{b}: {d}%',
          },
        },
      ],
    };
  }, [difficultySummary]);

  /** Top missed words sorted by miss count descending. */
  const topMisses = useMemo(() => {
    const missCounts = new Map<string, number>();
    for (const attempt of sortedHistory) {
      if (attempt.correct) {
        continue;
      }
      missCounts.set(attempt.word, (missCounts.get(attempt.word) ?? 0) + 1);
    }

    return Array.from(missCounts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [sortedHistory]);

  /** ECharts option for the top misses bar chart. */
  const missesOption = useMemo<EChartsOption>(() => {
    const words = topMisses.map((item) => item.word).reverse();
    const values = topMisses.map((item) => item.count).reverse();

    return {
      color: ['#f97316'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 140,
        right: 24,
        top: 16,
        bottom: 32,
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: words,
        axisLabel: {
          width: 120,
          overflow: 'truncate',
        },
      },
      series: [
        {
          name: 'Misses',
          type: 'bar',
          data: values,
          barWidth: '55%',
        },
      ],
    };
  }, [topMisses]);

  if (!hasHistory) {
    return null;
  }

  return (
    <Stack spacing={2.5}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
        Session Insights
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
          <InsightCard
            title="Progress Over Time"
            subtitle="Track how correct and incorrect answers evolve during your practice."
            option={trendOption}
            ariaLabel="Line chart showing cumulative correct and incorrect answers over time."
          />
        </Box>
        <Box>
          <InsightCard
            title="Attempts by Difficulty"
            subtitle="See which challenge levels you practice the most."
            option={difficultyOption}
            ariaLabel="Doughnut chart showing attempts grouped by difficulty level."
            emptyMessage="Practice more words to unlock difficulty insights."
            isEmpty={difficultySummary.length === 0}
          />
        </Box>
        <Box>
          <InsightCard
            title="Top Missed Words"
            subtitle="Focus on these to solidify your spelling."
            option={missesOption}
            ariaLabel="Bar chart of the words you miss most often."
            emptyMessage="Great job! You have not missed any words enough times to show here."
            isEmpty={topMisses.length === 0}
          />
        </Box>
      </Box>
    </Stack>
  );
}
