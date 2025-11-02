import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Settings } from '@/components/selectors/Settings';
import { PracticePanel } from '@/features/practice/PracticePanel';
import { ThemeProvider } from './providers/ThemeProvider';
import { I18nProvider } from './providers/I18nProvider';

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        <AppShell onSettingsClick={handleSettingsClick}>
          <PracticePanel />
          <Settings open={settingsOpen} onClose={handleSettingsClose} />
        </AppShell>
      </I18nProvider>
    </ThemeProvider>
  );
}
