import { useState } from 'react';
import type { ReactElement } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Settings } from '@/components/selectors/Settings';
import { PracticePanel } from '@/features/practice/PracticePanel';
import { I18nProvider } from './providers/I18nProvider';
import { ThemeProvider } from './providers/ThemeProvider';

/**
 * The main application component that sets up the overall structure and state management.
 *
 * @returns A React element representing the application.
 * @example
 * <App />
 */
export function App(): ReactElement {
  const [settingsOpen, setSettingsOpen] = useState(false);

  /**
   * Handles the click event for opening the settings dialog.
   */
  function handleSettingsClick(): void {
    setSettingsOpen(true);
  }

  /**
   * Handles the close event for the settings dialog.
   */
  function handleSettingsClose(): void {
    setSettingsOpen(false);
  }

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
