import type { PracticeAnalytics } from '@/domain/analytics/practiceAnalytics';
import type { EChartsOption } from 'echarts';

export interface PracticeChartOptions {
  trend: EChartsOption;
  difficulty: EChartsOption;
  misses: EChartsOption;
}

/** Translates the analytics view model into chart-library configuration. */
export function buildPracticeChartOptions(analytics: PracticeAnalytics): PracticeChartOptions {
  return {
    trend: {
      color: ['#2ecc71', '#e74c3c'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Correct', 'Incorrect'] },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: analytics.trend.map((item) => item.label),
      },
      yAxis: { type: 'value', minInterval: 1, axisLabel: { formatter: '{value}' } },
      series: [
        {
          name: 'Correct',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: analytics.trend.map((item) => item.correct),
        },
        {
          name: 'Incorrect',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: analytics.trend.map((item) => item.incorrect),
        },
      ],
    },
    difficulty: {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: 'Attempts',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          data: analytics.difficulty,
          avoidLabelOverlap: false,
          label: { formatter: '{b}: {d}%' },
        },
      ],
    },
    misses: {
      color: ['#f97316'],
      tooltip: { trigger: 'axis' },
      grid: { left: 140, right: 24, top: 16, bottom: 32 },
      xAxis: { type: 'value', minInterval: 1 },
      yAxis: {
        type: 'category',
        data: analytics.topMisses.map((item) => item.word).reverse(),
        axisLabel: { width: 120, overflow: 'truncate' },
      },
      series: [
        {
          name: 'Misses',
          type: 'bar',
          data: analytics.topMisses.map((item) => item.count).reverse(),
          barWidth: '55%',
        },
      ],
    },
  };
}
