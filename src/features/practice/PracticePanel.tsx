import React, { Suspense, lazy, useCallback, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import anime from 'animejs';
import { usePracticeStore } from '@/store/practiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { PlayButton } from '@/components/controls/PlayButton';
import { AnswerField } from '@/components/controls/AnswerField';
import { ScoreBar } from '@/components/feedback/ScoreBar';
import { CorrectnessChip } from '@/components/feedback/CorrectnessChip';
import { TtsService } from '@/domain/services/tts/TtsService';
import { DEFAULT_WORDS } from '@/data/loaders/DefaultDataLoader';
import { hasContent } from '@/utils/guards';
import { isBrowser } from '@/utils/common';
import {
  EmptyState,
  HintDisplay,
  AnswerButtons,
  FeedbackDisplay,
  DifficultyFilter,
} from './components';

/**
 * Lazy-loaded practice insights component.
 */
const PracticeInsights = lazy(async () => {
  const module = await import('./components/PracticeInsights');
  return { default: module.PracticeInsights };
});

const ttsService = new TtsService();

/**
 * Lightweight placeholder rendered while the insights bundle loads.
 *
 * @returns Skeleton card explaining that insights are loading
 */
function InsightsFallback(): ReactElement {
  return (
    <Card elevation={2}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Loading insights...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gathering your practice stats.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Renders the primary spelling practice workflow including playback, input, hints, and analytics.
 *
 * @returns Fully composed practice experience
 */
export function PracticePanel(): ReactElement {
  const {
    currentWord,
    userInput,
    isCorrect,
    showHint,
    hintType,
    wordsAttempted,
    wordsCorrect,
    currentStreak,
    setUserInput,
    checkAnswer,
    nextWord,
    toggleHint,
    resetSession,
    setWordPool,
    history,
  } = usePracticeStore();

  const { speechRate, speechVolume } = useSettingsStore();

  const answerInputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldShowInsights = history.length > 0;
  const insightsSection = shouldShowInsights ? (
    <Suspense fallback={<InsightsFallback />}>
      <PracticeInsights history={history} />
    </Suspense>
  ) : null;

  useEffect(() => {
    setWordPool(DEFAULT_WORDS);
  }, [setWordPool]);

  useEffect(() => {
    if (!currentWord) {
      return;
    }

    const speakWord = async (): Promise<void> => {
      try {
        await ttsService.speak(currentWord.word, {
          rate: speechRate,
          volume: speechVolume,
        });
      } catch (error) {
        console.error('TTS error:', error);
      }
    };

    void speakWord();
  }, [currentWord, speechRate, speechVolume]);

  useEffect(() => {
    if (!isBrowser() || !cardRef.current || !currentWord) {
      return;
    }

    anime({
      targets: cardRef.current,
      opacity: [
        { value: 0.85, duration: 120 },
        { value: 1, duration: 240 },
      ],
      translateY: [
        { value: 8, duration: 200 },
        { value: 0, duration: 350 },
      ],
      easing: 'easeOutCubic',
    });
  }, [currentWord?.word]);

  useEffect(() => {
    if (!isBrowser() || !cardRef.current || isCorrect === null) {
      return;
    }

    anime({
      targets: cardRef.current,
      backgroundColor: [
        'rgba(20,24,40,0)',
        isCorrect ? 'rgba(46, 204, 113, 0.08)' : 'rgba(231, 76, 60, 0.08)',
        'rgba(20,24,40,0)',
      ],
      duration: 700,
      easing: 'easeOutQuad',
    });
  }, [isCorrect]);

  /**
   * Focuses and selects the answer input, deferring to the next animation frame for smooth UX.
   */
  const focusAnswerInput = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    globalThis.requestAnimationFrame(() => {
      answerInputRef.current?.focus();
      answerInputRef.current?.select();
    });
  }, []);

  useEffect(() => {
    if (isCorrect === null) {
      focusAnswerInput();
    } else {
      nextButtonRef.current?.focus();
    }
  }, [isCorrect, focusAnswerInput]);

  /**
   * Plays the current word using the configured text-to-speech engine.
   */
  const handleSpeak = useCallback(async () => {
    if (!currentWord) {
      return;
    }

    try {
      await ttsService.speak(currentWord.word, {
        rate: speechRate,
        volume: speechVolume,
      });
    } catch (error) {
      console.error('TTS error:', error);
    }
  }, [currentWord, speechRate, speechVolume]);

  /**
   * Advances to the next word and re-focuses the answer input.
   */
  const handleNextWord = useCallback(() => {
    nextWord();
    focusAnswerInput();
  }, [nextWord, focusAnswerInput]);

  /**
   * Handles form submission, verifying correctness and advancing flow as needed.
   *
   * @param event - Form submission event
   */
  const handleSubmit = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();

      if (isCorrect !== null) {
        handleNextWord();
        return;
      }

      if (hasContent(userInput)) {
        checkAnswer();
      }
    },
    [checkAnswer, handleNextWord, isCorrect, userInput]
  );

  /**
   * Clears current progress and loads a fresh word to restart the session.
   */
  const handleReset = useCallback((): void => {
    resetSession();
    handleNextWord();
  }, [handleNextWord, resetSession]);

  if (!currentWord) {
    return (
      <Stack spacing={3} sx={{ width: '100%' }}>
        <DifficultyFilter />
        <EmptyState onStart={handleNextWord} />
        {insightsSection}
      </Stack>
    );
  }

  const wordsIncorrect = wordsAttempted - wordsCorrect;
  const accuracy = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <DifficultyFilter />
      <Card
        ref={cardRef}
        elevation={6}
        sx={{
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(160deg, rgba(30,41,59,0.85), rgba(15,23,42,0.95))'
              : 'linear-gradient(160deg, #f9fafb, #ffffff)',
          boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.14), 0px 0px 1px rgba(15, 23, 42, 0.08)',
          mx: 'auto',
          maxWidth: { xs: '100%', lg: '1120px' },
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2.5, sm: 3 },
            p: { xs: 3, sm: 4 },
          }}
        >
          <ScoreBar
            statistics={{
              wordsAttempted,
              wordsCorrect,
              wordsIncorrect,
              currentStreak,
              maxStreak: currentStreak,
              accuracy,
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            <Box>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
                Listen to the word
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Press play or tap the space bar to hear it again.
              </Typography>
            </Box>
            <PlayButton onClick={handleSpeak} />
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CorrectnessChip difficulty={currentWord.difficulty} />
          </Box>

          {showHint && hintType && <HintDisplay hintType={hintType} currentWord={currentWord} />}

          <Divider aria-hidden="true" />

          <Box component="form" onSubmit={handleSubmit} aria-label="Word submission form">
            <Stack spacing={2.5}>
              <AnswerField
                ref={answerInputRef}
                value={userInput}
                onChange={setUserInput}
                disabled={isCorrect !== null}
              />

              {isCorrect === null ? (
                <AnswerButtons onHint={toggleHint} isSubmitDisabled={!hasContent(userInput)} />
              ) : (
                <FeedbackDisplay
                  isCorrect={isCorrect}
                  currentWord={currentWord}
                  onNext={handleNextWord}
                  nextButtonRef={nextButtonRef}
                />
              )}
            </Stack>
          </Box>

          <Button
            variant="text"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
          >
            Reset Session
          </Button>
        </CardContent>
      </Card>

      {insightsSection}
    </Stack>
  );
}
