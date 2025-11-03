import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import * as echarts from 'echarts';
import type { EChartsType, EChartsOption } from 'echarts';
import { Box } from '@mui/material';
import { isBrowser } from '@/utils/common';

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
      chartInstance.current?.resize();
    };

    window.addEventListener?.('resize', handleResize);

    return () => {
      window.removeEventListener?.('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !option) {
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
