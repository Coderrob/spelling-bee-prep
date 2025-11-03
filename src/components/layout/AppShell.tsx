import { Box, Container } from '@mui/material';
import { TopBar } from './TopBar';
import type { ReactNode, ReactElement } from 'react';

interface AppShellProps {
  children: ReactNode;
  onSettingsClick: () => void;
}

export function AppShell({ children, onSettingsClick }: Readonly<AppShellProps>): ReactElement {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar onSettingsClick={onSettingsClick} />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: { sm: '720px', md: '960px', lg: '1280px' },
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
