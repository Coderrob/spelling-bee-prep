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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/settingsStore';
import { MIN_SPEECH_RATE, MAX_SPEECH_RATE, MIN_VOLUME, MAX_VOLUME } from '@/types/constants';
import { isNumber } from '@/utils/guards';

/**
 * Props for the Settings component.
 */
interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Component rendering the settings dialog for adjusting application preferences.
 *
 * @param open - Indicates if the settings dialog is open.
 * @param onClose - Callback function to close the settings dialog.
 * @returns A React element representing the settings dialog.
 * @example
 * <Settings open={isSettingsOpen} onClose={handleCloseSettings} />
 */
export function Settings({ open, onClose }: Readonly<SettingsProps>): ReactElement {
  const { t, i18n } = useTranslation();
  const { speechRate, speechVolume, setSpeechRate, setSpeechVolume } = useSettingsStore();

  /**
   * Handles changes to the speech rate slider.
   * @param _event - The event object (not used).
   * @param value - The new rate value from the slider.
   */
  function handleRateChange(_event: Event, value: number | number[]): void {
    if (isNumber(value)) {
      setSpeechRate(value);
    }
  }

  /**
   * Handles changes to the speech volume slider.
   * @param _event - The event object (not used).
   * @param value - The new volume value from the slider.
   */
  function handleVolumeChange(_event: Event, value: number | number[]): void {
    if (isNumber(value)) {
      setSpeechVolume(value);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>{t('settings.language')}</InputLabel>
            <Select
              value={i18n.language}
              label={t('settings.language')}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>{t('settings.speechRate')}</Typography>
            <Slider
              value={speechRate}
              onChange={handleRateChange}
              min={MIN_SPEECH_RATE}
              max={MAX_SPEECH_RATE}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>{t('settings.volume')}</Typography>
            <Slider
              value={speechVolume}
              onChange={handleVolumeChange}
              min={MIN_VOLUME}
              max={MAX_VOLUME}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Button variant="contained" onClick={onClose} fullWidth>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
