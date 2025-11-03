/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ReactNode, ReactElement } from 'react';
import { Box, Container } from '@mui/material';
import { TopBar } from './TopBar';

/**
 * Props for the AppShell component.
 */
interface AppShellProps {
  children: ReactNode;
  onSettingsClick: () => void;
}

/**
 * Component that provides the overall layout structure of the application.
 *
 * @param children - The main content to be displayed within the app shell.
 * @param onSettingsClick - Callback function to handle settings button click.
 * @returns A React element representing the app shell.
 * @example
 * <AppShell onSettingsClick={handleSettingsClick}>
 *   <MainContent />
 * </AppShell>
 */
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
