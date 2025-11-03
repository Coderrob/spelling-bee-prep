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

import type { ReactElement } from 'react';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { APP_NAME, APP_EMOJI } from '@/types/constants';

/**
 * Props for the TopBar component.
 */
interface TopBarProps {
  onSettingsClick: () => void;
}

/**
 * Component rendering the top bar of the application.
 *
 * @param onSettingsClick - Callback function to handle settings button click.
 * @returns A React element representing the top bar.
 * @example
 * <TopBar onSettingsClick={handleSettingsClick} />
 */
export function TopBar({ onSettingsClick }: Readonly<TopBarProps>): ReactElement {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {APP_EMOJI} {APP_NAME}
        </Typography>
        <IconButton color="inherit" onClick={onSettingsClick} aria-label="Settings">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
