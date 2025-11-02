import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { VolumeUp, Lightbulb, NavigateNext, RestartAlt } from '@mui/icons-material';
import { usePracticeStore } from './store';
import { getTTSService } from '@/domain/services/tts';
import { useTranslation } from 'react-i18next';

export const PracticeMode: React.FC = () => {
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
  } = usePracticeStore();

  const ttsService = getTTSService();

  const handleSpeak = React.useCallback(async () => {
    if (currentWord) {
      try {
        await ttsService.speak(currentWord.word);
      } catch (error) {
        console.error('TTS error:', error);
      }
    }
  }, [currentWord, ttsService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      checkAnswer();
    }
  };

  const handleNext = () => {
    nextWord();
  };

  useEffect(() => {
    if (currentWord) {
      handleSpeak();
    }
  }, [currentWord, handleSpeak]);

  if (!currentWord) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Statistics */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip label={`${t('practice.title')}: ${wordsAttempted}`} color="primary" />
              <Chip label={`✓ ${wordsCorrect}`} color="success" />
              <Chip label={`🔥 ${currentStreak}`} color="warning" />
            </Box>

            {/* Word pronunciation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">Listen to the word</Typography>
              <IconButton color="primary" size="large" onClick={handleSpeak}>
                <VolumeUp fontSize="large" />
              </IconButton>
            </Box>

            {/* Difficulty indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                label={t(`practice.difficulty.${currentWord.difficulty}`)}
                color={
                  currentWord.difficulty === 'easy'
                    ? 'success'
                    : currentWord.difficulty === 'medium'
                      ? 'warning'
                      : 'error'
                }
              />
            </Box>

            {/* Hint section */}
            {showHint && hintType && (
              <Alert severity="info">
                <Typography variant="subtitle2" fontWeight="bold">
                  {t(`practice.hints.${hintType}`)}:
                </Typography>
                <Typography>
                  {hintType === 'definition' && currentWord.definition}
                  {hintType === 'usageExample' && currentWord.usageExample}
                  {hintType === 'origin' && currentWord.origin}
                </Typography>
              </Alert>
            )}

            {/* Answer form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Type the word"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isCorrect !== null}
                  autoFocus
                  autoComplete="off"
                />

                {isCorrect === null ? (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Lightbulb />}
                      onClick={() => toggleHint('definition')}
                      fullWidth
                    >
                      {t('practice.hint')}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={!userInput.trim()}
                    >
                      {t('practice.submit')}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Alert severity={isCorrect ? 'success' : 'error'}>
                      <Typography variant="h6">
                        {isCorrect ? t('practice.correct') : t('practice.incorrect')}
                      </Typography>
                      <Typography>
                        The word is: <strong>{currentWord.word}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {currentWord.definition}
                      </Typography>
                    </Alert>
                    <Button
                      variant="contained"
                      startIcon={<NavigateNext />}
                      onClick={handleNext}
                      fullWidth
                    >
                      {t('practice.nextWord')}
                    </Button>
                  </>
                )}
              </Stack>
            </form>

            {/* Reset button */}
            <Button variant="text" startIcon={<RestartAlt />} onClick={resetSession} sx={{ mt: 2 }}>
              Reset Session
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};
