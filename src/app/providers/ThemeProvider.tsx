import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/styles/theme';
import type { ReactNode, ReactElement } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
