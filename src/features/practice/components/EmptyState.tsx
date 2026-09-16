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
import { ArrowForward, GraphicEq, Keyboard, TrendingUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const practiceSteps = [
  {
    icon: GraphicEq,
    title: 'Listen',
    description: 'Replay the pronunciation whenever you need it.',
  },
  {
    icon: Keyboard,
    title: 'Spell',
    description: 'Type the word with a clear, distraction-free prompt.',
  },
  { icon: TrendingUp, title: 'Grow', description: 'Use feedback and adaptive review to improve.' },
] as const;

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  onStart: () => void;
}

/**
 * Component displayed when there are no words to practice.
 *
 * @param onStart - Callback function to initiate the practice session.
 * @returns A React element representing the empty state.
 * @example
 * <EmptyState onStart={handleStartPractice} />
 */
export function EmptyState({ onStart }: Readonly<EmptyStateProps>): ReactElement {
  const { t } = useTranslation();

  return (
    <section className="practice-intro">
      <div className="practice-intro__layout">
        <div className="practice-intro__content">
          <span className="practice-intro__eyebrow">Ready when you are</span>
          <h2 className="practice-intro__title">
            Build spelling confidence,
            <span className="practice-intro__title-accent"> one word at a time.</span>
          </h2>
          <p className="practice-intro__summary">
            Your practice set is ready. Listen carefully, type what you hear, and get helpful
            feedback right away.
          </p>
          <Button
            variant="contained"
            onClick={onStart}
            endIcon={<ArrowForward />}
            sx={{ mt: 4, minWidth: { xs: '100%', sm: 220 } }}
          >
            {t('practice.startPractice')}
          </Button>
          <p className="practice-intro__note">No timer · Learn at your pace</p>
        </div>
        <div className="practice-intro__steps">
          <h3 className="practice-intro__steps-title">How practice works</h3>
          <ol className="practice-intro__step-list">
            {practiceSteps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="practice-intro__step">
                <span className="practice-intro__step-icon">
                  <Icon fontSize="small" aria-hidden="true" />
                </span>
                <div className="practice-intro__step-content">
                  <p className="practice-intro__step-title">
                    {index + 1}. {title}
                  </p>
                  <p className="practice-intro__step-description">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
