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

import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Box } from '@mui/material';
import * as echarts from 'echarts';
import { isBrowser } from '@/utils/common';
import type { EChartsType, EChartsOption } from 'echarts';

/** Props for the InsightChart component. */
interface InsightChartProps {
  option: EChartsOption;
  ariaLabel: string;
  height?: number;
}

/**
 * Responsive ECharts renderer used by insight cards.
 *
 * @param props - Component props
 * @param props.option - Fully constructed ECharts option object
 * @param props.ariaLabel - Accessible label describing the chart contents
 * @param props.height - Optional fixed height for the chart container
 * @returns A box element hosting the rendered chart
 * @example
 * ```tsx
 * <InsightChart
 *   option={chartOption}
 *   ariaLabel="Line chart showing practice trends"
 *   height={300}
 * />
 * ```
 */
export function InsightChart({
  option,
  ariaLabel,
  height = 320,
}: Readonly<InsightChartProps>): ReactElement {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!isBrowser() || !chartRef.current) {
      return;
    }

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: 'svg',
    });

    const handleResize = (): void => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) {
      return;
    }

    chartInstance.current.setOption(option, true);
  }, [option]);

  return (
    <Box
      ref={chartRef}
      role="img"
      aria-label={ariaLabel}
      sx={{
        width: '100%',
        height,
      }}
    />
  );
}
