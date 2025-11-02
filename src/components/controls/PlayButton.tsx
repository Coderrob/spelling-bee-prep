import { IconButton } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';

interface PlayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function PlayButton({ onClick, disabled = false, size = 'large' }: PlayButtonProps) {
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
