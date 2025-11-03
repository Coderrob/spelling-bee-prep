import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { APP_NAME, APP_EMOJI } from '@/types/constants';
import type { ReactElement } from 'react';

interface TopBarProps {
  onSettingsClick: () => void;
}

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
