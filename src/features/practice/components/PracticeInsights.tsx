import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { buildPracticeAnalytics } from '@/domain/analytics/practiceAnalytics';
import type { PracticeAttempt } from '@/types';
import { InsightCard } from './insights';
import { buildPracticeChartOptions } from '../analytics/chartOptions';

interface PracticeInsightsProps {
  history: PracticeAttempt[];
}

/** Renders charts from a domain-generated practice analytics view model. */
export function PracticeInsights({
  history,
}: Readonly<PracticeInsightsProps>): ReactElement | null {
  const analytics = useMemo(() => buildPracticeAnalytics(history), [history]);
  const charts = useMemo(() => buildPracticeChartOptions(analytics), [analytics]);

  if (history.length === 0) {
    return null;
  }

  const latestTrend = analytics.trend.at(-1);
  const trendSummary = `Cumulative practice results: ${latestTrend?.correct ?? 0} correct and ${latestTrend?.incorrect ?? 0} incorrect across ${history.length} attempts.`;
  const difficultySummary = `Attempts by difficulty: ${analytics.difficulty.map(({ name, value }) => `${name} ${value}`).join(', ')}.`;
  const missesSummary = `Most frequently missed words: ${analytics.topMisses.map(({ word, count }) => `${word} ${count}`).join(', ')}.`;

  return (
    <section className="insights" aria-labelledby="session-insights-title">
      <div>
        <p className="insights__eyebrow">Your learning story</p>
        <h2 id="session-insights-title" className="insights__title">
          Session insights
        </h2>
      </div>
      <div className="insights__grid">
        <div className="insights__primary">
          <InsightCard
            title="Progress Over Time"
            subtitle="Track how correct and incorrect answers evolve during your practice."
            option={charts.trend}
            ariaLabel={trendSummary}
          />
        </div>
        <InsightCard
          title="Attempts by Difficulty"
          subtitle="See which challenge levels you practice the most."
          option={charts.difficulty}
          ariaLabel={difficultySummary}
          emptyMessage="Practice more words to unlock difficulty insights."
          isEmpty={analytics.difficulty.length === 0}
        />
        <InsightCard
          title="Top Missed Words"
          subtitle="Focus on these to solidify your spelling."
          option={charts.misses}
          ariaLabel={missesSummary}
          emptyMessage="Great job! You have not missed any words enough times to show here."
          isEmpty={analytics.topMisses.length === 0}
        />
      </div>
    </section>
  );
}
