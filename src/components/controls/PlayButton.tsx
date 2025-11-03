import { IconButton } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import type { ReactElement } from 'react';
import { Size } from '@/types';

/** Props for the PlayButton component. */
interface PlayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: Size;
}

/**
 * Component rendering a play button for pronunciation.
 *
 * @param onClick - Callback function to handle button click.
 * @param disabled - Indicates if the button is disabled.
 * @param size - Size of the button ('small', 'medium', 'large').
 * @returns A React element representing the play button.
 * @example
 * <PlayButton onClick={handlePlay} disabled={false} size="large" />
 */
export function PlayButton({
  onClick,
  disabled = false,
  size = Size.LARGE,
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
