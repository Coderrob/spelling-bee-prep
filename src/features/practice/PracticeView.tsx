import { Suspense, lazy } from 'react';
import type { ReactElement } from 'react';
import { RestartAlt } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { AnswerField } from '@/components/controls/AnswerField';
import { PlayButton } from '@/components/controls/PlayButton';
import { CorrectnessChip } from '@/components/feedback/CorrectnessChip';
import { ScoreBar } from '@/components/feedback/ScoreBar';
import {
  AnswerButtons,
  DifficultyFilter,
  EmptyState,
  FeedbackDisplay,
  GradeSelector,
  HintDisplay,
  PracticeModeSelector,
} from './components';
import type { PracticeSessionController } from './usePracticeSessionController';

const PracticeInsights = lazy(async () => {
  const module = await import('./components/PracticeInsights');
  return { default: module.PracticeInsights };
});

interface PracticeControlsProps {
  isPageHeading?: boolean;
}

function PracticeControls({ isPageHeading = false }: PracticeControlsProps): ReactElement {
  const Heading = isPageHeading ? 'h1' : 'h2';
  return (
    <section className="practice-setup" aria-labelledby="practice-setup-title">
      <div className="practice-setup__header">
        <div>
          <p className="practice-setup__eyebrow">Personalized practice</p>
          <Heading id="practice-setup-title" className="practice-setup__title">
            Shape your session
          </Heading>
        </div>
        <p className="practice-setup__summary">
          Pick a grade and practice style. You can change these choices at any time.
        </p>
      </div>
      <div className="practice-setup__grid">
        <GradeSelector />
        <DifficultyFilter />
        <PracticeModeSelector />
      </div>
    </section>
  );
}

function Insights({ history }: Pick<PracticeSessionController, 'history'>): ReactElement | null {
  return history.length > 0 ? (
    <Suspense
      fallback={
        <div className="practice-status" role="status">
          <p className="practice-status__message">Gathering your practice stats...</p>
        </div>
      }
    >
      <PracticeInsights history={history} />
    </Suspense>
  ) : null;
}

/** Presentational practice workflow driven entirely by a controller contract. */
export function PracticeView(controller: Readonly<PracticeSessionController>): ReactElement {
  const { currentWord } = controller;
  if (!currentWord) {
    return (
      <div className="practice-page">
        <PracticeControls isPageHeading />
        {controller.catalogStatus === 'loading' && (
          <div className="practice-status" role="status" aria-live="polite">
            <div className="practice-status__content">
              <CircularProgress aria-label="Loading word catalog" size={34} />
              <p className="practice-status__message">Preparing your grade-level words...</p>
            </div>
          </div>
        )}
        {controller.catalogStatus === 'error' && (
          <div className="practice-status practice-status--error" role="alert">
            {controller.catalogError}
          </div>
        )}
        {controller.catalogStatus === 'ready' && <EmptyState onStart={controller.startOrAdvance} />}
        <Insights history={controller.history} />
      </div>
    );
  }

  return (
    <div className="practice-page">
      <div
        ref={controller.cardRef}
        className="practice-card"
        role="region"
        aria-labelledby="practice-word-prompt"
      >
        <div className="practice-card__header">
          <p className="practice-card__status">
            <span className="practice-card__status-dot" aria-hidden="true" />
            Practice in progress
          </p>
          <button type="button" className="practice-card__reset" onClick={controller.reset}>
            <RestartAlt fontSize="small" aria-hidden="true" />
            Restart
          </button>
        </div>
        <div className="practice-card__body">
          <ScoreBar statistics={controller.statistics} />
          <div className="audio-prompt">
            <p className="audio-prompt__step">Step 1 · Listen</p>
            <h1 id="practice-word-prompt" className="audio-prompt__title">
              Hear your next word
            </h1>
            <p className="audio-prompt__summary">
              Listen as many times as you need. The word stays hidden until you answer.
            </p>
            <div className="audio-prompt__action">
              <PlayButton onClick={controller.speak} disabled={controller.isSpeaking} />
            </div>
            <p className="audio-prompt__status" aria-live="polite">
              {controller.speechError ?? (controller.isSpeaking ? 'Playing pronunciation...' : '')}
            </p>
            <div className="audio-prompt__meta">
              <CorrectnessChip difficulty={currentWord.difficulty} />
            </div>
          </div>
          {controller.showHint && controller.hintType && (
            <HintDisplay hintType={controller.hintType} currentWord={currentWord} />
          )}
          <form
            onSubmit={controller.submit}
            aria-label="Word submission form"
            className="answer-form"
          >
            <div className="answer-form__heading">
              <p className="answer-form__step">Step 2 · Spell</p>
              <h3 className="answer-form__title">Type the word you heard</h3>
            </div>
            <div className="answer-form__controls">
              <AnswerField
                ref={controller.answerInputRef}
                value={controller.userInput}
                onChange={controller.setUserInput}
                disabled={controller.isCorrect !== null}
              />
              {controller.isCorrect === null ? (
                <AnswerButtons
                  onHint={controller.showHintOfType}
                  isSubmitDisabled={controller.isSubmitDisabled}
                />
              ) : (
                <FeedbackDisplay
                  isCorrect={controller.isCorrect}
                  currentWord={currentWord}
                  onNext={controller.startOrAdvance}
                  nextButtonRef={controller.nextButtonRef}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      <PracticeControls />
      <Insights history={controller.history} />
    </div>
  );
}
