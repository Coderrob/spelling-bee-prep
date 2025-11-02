import React, { useState } from 'react';
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

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const [speechRate, setSpeechRate] = useState(1);
  const [volume, setVolume] = useState(1);

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
              onChange={(_, value) => setSpeechRate(value as number)}
              min={0.5}
              max={2}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>{t('settings.volume')}</Typography>
            <Slider
              value={volume}
              onChange={(_, value) => setVolume(value as number)}
              min={0}
              max={1}
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
};
