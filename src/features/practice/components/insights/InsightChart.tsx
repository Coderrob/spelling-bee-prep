import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import * as echarts from 'echarts';
import type { EChartsType, EChartsOption } from 'echarts';
import { Box } from '@mui/material';
import { isBrowser } from '@/utils/common';

interface InsightChartProps {
  option: EChartsOption;
  ariaLabel: string;
  height?: number;
}

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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
