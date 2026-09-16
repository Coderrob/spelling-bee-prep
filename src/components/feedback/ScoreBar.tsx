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
import type { PracticeStatistics } from '@/types';
import { Stat } from './Stat';

/** Props for the ScoreBar component. */
interface ScoreBarProps {
  statistics: PracticeStatistics;
}

/**
 * Displays top-line practice statistics in a responsive row.
 *
 * @param props - Component props
 * @param props.statistics - Aggregated practice statistics to render
 * @returns Material UI paper summarizing current performance
 * @example
 * ```tsx
 * <ScoreBar statistics={practiceStatistics} />
 * ```
 */
export function ScoreBar({ statistics }: Readonly<ScoreBarProps>): ReactElement {
  return (
    <section role="region" aria-label="Practice statistics summary" className="scoreboard">
      <dl className="scoreboard__grid">
        <Stat label="Attempted" value={statistics.wordsAttempted} />
        <Stat label="Correct" value={statistics.wordsCorrect} color="#047857" />
        <Stat label="To review" value={statistics.wordsIncorrect} color="#be123c" />
        <Stat label="Accuracy" value={`${Math.round(statistics.accuracy)}%`} />
        <Stat label="Streak" value={`${statistics.currentStreak} 🔥`} />
      </dl>
    </section>
  );
}
