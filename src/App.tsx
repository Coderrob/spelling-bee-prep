import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Box,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { theme } from './app/theme';
import { Settings } from './components/Settings';
import { ModeSelector } from './features/practice/ModeSelector';
import { PracticeMode } from './features/practice/PracticeMode';
import { usePracticeStore } from './features/practice/store';
import { defaultWordSet } from './data/dictionaries/default-words';
import { validateWordSet } from './data/dictionaries/schema';
import './app/i18n';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const { setWordPool, nextWord } = usePracticeStore();

  useEffect(() => {
    // Validate and load word set
    try {
      const validatedWordSet = validateWordSet(defaultWordSet);
      setWordPool(validatedWordSet.words);
    } catch (error) {
      console.error('Failed to validate word set:', error);
    }
  }, [setWordPool]);

  const handleStartPractice = () => {
    setPracticeStarted(true);
    nextWord();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🐝 Spelling Bee Prep
            </Typography>
            <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
          {!practiceStarted ? <ModeSelector onStart={handleStartPractice} /> : <PracticeMode />}
        </Container>

        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
