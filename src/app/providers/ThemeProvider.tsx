import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/styles/theme';
import type { ReactNode, ReactElement } from 'react';

/** Props for the ThemeProvider component. */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Component that provides theming support using Material-UI's ThemeProvider.
 *
 * @param children - The child components that require theming support.
 * @returns A React element that wraps children with MuiThemeProvider.
 * @example
 * <ThemeProvider>
 *   <YourComponent />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }: Readonly<ThemeProviderProps>): ReactElement {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
