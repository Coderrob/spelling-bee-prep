import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Shuffle, School, EmojiEvents } from '@mui/icons-material';
import { usePracticeStore } from './store';
import type { PracticeMode as PracticeModeType, Difficulty } from './store';
import { useTranslation } from 'react-i18next';

interface ModeSelectorProps {
  onStart: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const { mode, selectedDifficulty, setMode, setDifficulty } = usePracticeStore();

  const handleModeSelect = (selectedMode: PracticeModeType) => {
    setMode(selectedMode);
    if (selectedMode !== 'difficulty') {
      setDifficulty(null);
    }
  };

  const modes = [
    {
      id: 'random' as const,
      icon: <Shuffle fontSize="large" />,
      title: t('practice.modes.random'),
      description: 'Practice words in random order',
    },
    {
      id: 'difficulty' as const,
      icon: <School fontSize="large" />,
      title: t('practice.modes.difficulty'),
      description: 'Practice words by difficulty level',
    },
    {
      id: 'challenges' as const,
      icon: <EmojiEvents fontSize="large" />,
      title: t('practice.modes.challenges'),
      description: 'Take on spelling challenges',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Choose Practice Mode
      </Typography>
      <Stack spacing={2} sx={{ mt: 3 }}>
        {modes.map((modeOption) => (
          <Card
            key={modeOption.id}
            sx={{
              cursor: 'pointer',
              border: mode === modeOption.id ? '2px solid' : '1px solid',
              borderColor: mode === modeOption.id ? 'primary.main' : 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
            onClick={() => handleModeSelect(modeOption.id)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'primary.main' }}>{modeOption.icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{modeOption.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {modeOption.description}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {mode === 'difficulty' && (
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Select Difficulty</InputLabel>
          <Select
            value={selectedDifficulty || ''}
            label="Select Difficulty"
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <MenuItem value="easy">{t('practice.difficulty.easy')}</MenuItem>
            <MenuItem value="medium">{t('practice.difficulty.medium')}</MenuItem>
            <MenuItem value="hard">{t('practice.difficulty.hard')}</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3 }}
        onClick={onStart}
        disabled={mode === 'difficulty' && !selectedDifficulty}
      >
        {t('practice.startPractice')}
      </Button>
    </Box>
  );
};
