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
export function PracticeView({
  answerInputRef,
  cardRef,
  catalogError,
  catalogStatus,
  currentWord,
  history,
  hintType,
  isCorrect,
  isSpeaking,
  isSubmitDisabled,
  nextButtonRef,
  reset,
  setUserInput,
  showHint,
  showHintOfType,
  speak,
  speechError,
  startOrAdvance,
  statistics,
  submit,
  userInput,
}: Readonly<PracticeSessionController>): ReactElement {
  if (!currentWord) {
    return (
      <div className="practice-page">
        <PracticeControls isPageHeading />
        {catalogStatus === 'loading' && (
          <div className="practice-status" role="status" aria-live="polite">
            <div className="practice-status__content">
              <CircularProgress aria-label="Loading word catalog" size={34} />
              <p className="practice-status__message">Preparing your grade-level words...</p>
            </div>
          </div>
        )}
        {catalogStatus === 'error' && (
          <div className="practice-status practice-status--error" role="alert">
            {catalogError}
          </div>
        )}
        {catalogStatus === 'ready' && <EmptyState onStart={startOrAdvance} />}
        <Insights history={history} />
      </div>
    );
  }

  return (
    <div className="practice-page">
      <div
        ref={cardRef}
        className="practice-card"
        role="region"
        aria-labelledby="practice-word-prompt"
      >
        <div className="practice-card__header">
          <p className="practice-card__status">
            <span className="practice-card__status-dot" aria-hidden="true" />
            Practice in progress
          </p>
          <button type="button" className="practice-card__reset" onClick={reset}>
            <RestartAlt fontSize="small" aria-hidden="true" />
            Restart
          </button>
        </div>
        <div className="practice-card__body">
          <ScoreBar statistics={statistics} />
          <div className="audio-prompt">
            <p className="audio-prompt__step">Step 1 · Listen</p>
            <h1 id="practice-word-prompt" className="audio-prompt__title">
              Hear your next word
            </h1>
            <p className="audio-prompt__summary">
              Listen as many times as you need. The word stays hidden until you answer.
            </p>
            <div className="audio-prompt__action">
              <PlayButton onClick={speak} disabled={isSpeaking} />
            </div>
            <p className="audio-prompt__status" aria-live="polite">
              {speechError ?? (isSpeaking ? 'Playing pronunciation...' : '')}
            </p>
            <div className="audio-prompt__meta">
              <CorrectnessChip difficulty={currentWord.difficulty} />
            </div>
          </div>
          {showHint && hintType && <HintDisplay hintType={hintType} currentWord={currentWord} />}
          <form onSubmit={submit} aria-label="Word submission form" className="answer-form">
            <div className="answer-form__heading">
              <p className="answer-form__step">Step 2 · Spell</p>
              <h3 className="answer-form__title">Type the word you heard</h3>
            </div>
            <div className="answer-form__controls">
              <AnswerField
                ref={answerInputRef}
                value={userInput}
                onChange={setUserInput}
                disabled={isCorrect !== null}
              />
              {isCorrect === null ? (
                <AnswerButtons onHint={showHintOfType} isSubmitDisabled={isSubmitDisabled} />
              ) : (
                <FeedbackDisplay
                  isCorrect={isCorrect}
                  currentWord={currentWord}
                  onNext={startOrAdvance}
                  nextButtonRef={nextButtonRef}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      <PracticeControls />
      <Insights history={history} />
    </div>
  );
}
