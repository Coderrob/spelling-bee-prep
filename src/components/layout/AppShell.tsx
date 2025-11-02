import { Box, Container } from '@mui/material';
import { TopBar } from './TopBar';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  onSettingsClick: () => void;
}

export function AppShell({ children, onSettingsClick }: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar onSettingsClick={onSettingsClick} />
      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
