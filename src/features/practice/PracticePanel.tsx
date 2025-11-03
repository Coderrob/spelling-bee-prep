import React, { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Box, Card, CardContent, Stack, Button, Alert, Typography } from '@mui/material';
import { NavigateNext, Lightbulb, RestartAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { usePracticeStore } from '@/store/practiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { PlayButton } from '@/components/controls/PlayButton';
import { AnswerField } from '@/components/controls/AnswerField';
import { ScoreBar } from '@/components/feedback/ScoreBar';
import { CorrectnessChip } from '@/components/feedback/CorrectnessChip';
import { TtsService } from '@/domain/services/tts/TtsService';
import { DEFAULT_WORDS } from '@/data/loaders/DefaultDataLoader';
import { HintType } from '@/types';

const ttsService = new TtsService();

export function PracticePanel(): ReactElement {
  const { t } = useTranslation();
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
  } = usePracticeStore();

  const { speechRate, speechVolume } = useSettingsStore();

  // Load word pool on mount
  useEffect(() => {
    setWordPool(DEFAULT_WORDS);
  }, [setWordPool]);

  const handleSpeak = React.useCallback(async () => {
    if (currentWord) {
      try {
        await ttsService.speak(currentWord.word, {
          rate: speechRate,
          volume: speechVolume,
        });
      } catch (error) {
        console.error('TTS error:', error);
      }
    }
  }, [currentWord, speechRate, speechVolume]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (isInputValid()) {
      checkAnswer();
    }
  };

  const isInputValid = (): boolean => {
    return userInput.trim().length > 0;
  };

  useEffect(() => {
    if (currentWord) {
      handleSpeak();
    }
  }, [currentWord, handleSpeak]);

  if (!currentWord) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t('practice.title')}
          </Typography>
          <Button variant="contained" onClick={nextWord} fullWidth>
            {t('practice.startPractice')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <ScoreBar
            statistics={{
              wordsAttempted,
              wordsCorrect,
              wordsIncorrect: wordsAttempted - wordsCorrect,
              currentStreak,
              maxStreak: currentStreak,
              accuracy: wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">Listen to the word</Typography>
            <PlayButton onClick={handleSpeak} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CorrectnessChip difficulty={currentWord.difficulty} />
          </Box>

          {showHint && hintType && renderHint()}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <AnswerField
                value={userInput}
                onChange={setUserInput}
                disabled={isCorrect !== null}
              />

              {isCorrect === null ? renderAnswerButtons() : renderFeedback()}
            </Stack>
          </form>

          <Button variant="text" startIcon={<RestartAlt />} onClick={resetSession} sx={{ mt: 2 }}>
            Reset Session
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  function renderHint(): ReactElement {
    const hintContent = getHintContent();
    return (
      <Alert severity="info">
        <Typography variant="subtitle2" fontWeight="bold">
          {t(`practice.hints.${hintType}`)}:
        </Typography>
        <Typography>{hintContent}</Typography>
      </Alert>
    );
  }

  function getHintContent(): string {
    if (!currentWord) return '';
    switch (hintType) {
      case HintType.DEFINITION:
        return currentWord.definition;
      case HintType.USAGE_EXAMPLE:
        return currentWord.usageExample || '';
      case HintType.ORIGIN:
        return currentWord.origin || '';
      default:
        return '';
    }
  }

  function renderAnswerButtons(): ReactElement {
    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Lightbulb />}
          onClick={() => toggleHint(HintType.DEFINITION)}
          fullWidth
        >
          {t('practice.hint')}
        </Button>
        <Button type="submit" variant="contained" fullWidth disabled={!isInputValid()}>
          {t('practice.submit')}
        </Button>
      </Box>
    );
  }

  function renderFeedback(): ReactElement {
    return (
      <>
        <Alert severity={isCorrect ? 'success' : 'error'}>
          <Typography variant="h6">
            {isCorrect ? t('practice.correct') : t('practice.incorrect')}
          </Typography>
          <Typography>
            The word is: <strong>{currentWord?.word}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {currentWord?.definition}
          </Typography>
        </Alert>
        <Button variant="contained" startIcon={<NavigateNext />} onClick={nextWord} fullWidth>
          {t('practice.nextWord')}
        </Button>
      </>
    );
  }
}
