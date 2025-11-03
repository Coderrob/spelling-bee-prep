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
import { VolumeUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
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
