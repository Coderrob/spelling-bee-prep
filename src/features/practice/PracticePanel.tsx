import React, { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Box, Card, CardContent, Stack, Button, Typography } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { usePracticeStore } from '@/store/practiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { PlayButton } from '@/components/controls/PlayButton';
import { AnswerField } from '@/components/controls/AnswerField';
import { ScoreBar } from '@/components/feedback/ScoreBar';
import { CorrectnessChip } from '@/components/feedback/CorrectnessChip';
import { TtsService } from '@/domain/services/tts/TtsService';
import { DEFAULT_WORDS } from '@/data/loaders/DefaultDataLoader';
import { hasContent } from '@/utils/guards';
import { EmptyState, HintDisplay, AnswerButtons, FeedbackDisplay } from './components';

const ttsService = new TtsService();

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
    return hasContent(userInput);
  };

  useEffect(() => {
    if (currentWord) {
      handleSpeak();
    }
  }, [currentWord, handleSpeak]);

  if (!currentWord) {
    return <EmptyState onStart={nextWord} />;
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

          {showHint && hintType && <HintDisplay hintType={hintType} currentWord={currentWord} />}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <AnswerField
                value={userInput}
                onChange={setUserInput}
                disabled={isCorrect !== null}
              />

              {isCorrect === null ? (
                <AnswerButtons onHint={toggleHint} isSubmitDisabled={!isInputValid()} />
              ) : (
                <FeedbackDisplay isCorrect={isCorrect} currentWord={currentWord} onNext={nextWord} />
              )}
            </Stack>
          </form>

          <Button variant="text" startIcon={<RestartAlt />} onClick={resetSession} sx={{ mt: 2 }}>
            Reset Session
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
