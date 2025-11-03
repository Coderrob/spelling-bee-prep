import { IconButton } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import type { ReactElement } from 'react';

interface PlayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function PlayButton({
  onClick,
  disabled = false,
  size = 'large',
}: Readonly<PlayButtonProps>): ReactElement {
  return (
    <IconButton
      color="primary"
      size={size}
      onClick={onClick}
      disabled={disabled}
      aria-label="Play pronunciation"
    >
      <VolumeUp fontSize={size} />
    </IconButton>
  );
}
