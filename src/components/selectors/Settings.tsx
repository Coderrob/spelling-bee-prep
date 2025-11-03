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
import type { ReactElement } from 'react';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export function Settings({ open, onClose }: Readonly<SettingsProps>): ReactElement {
  const { t, i18n } = useTranslation();
  const { speechRate, speechVolume, setSpeechRate, setSpeechVolume } = useSettingsStore();

  function handleRateChange(_event: Event, value: number | number[]): void {
    if (isNumber(value)) {
      setSpeechRate(value);
    }
  }

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
