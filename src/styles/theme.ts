import { createTheme } from '@mui/material/styles';
import { THEME_COLOR } from '@/types/constants';

export const theme = createTheme({
  palette: {
    primary: {
      main: THEME_COLOR,
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
