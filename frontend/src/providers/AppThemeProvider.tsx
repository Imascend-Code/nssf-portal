import React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from '../theme';

type Mode = 'light' | 'dark';

interface ColorModeContextType {
  toggle: () => void;
  mode: Mode;
}

export const ColorModeContext = React.createContext<ColorModeContextType>({
  toggle: () => {},
  mode: 'light',
});

const STORAGE_KEY = 'mui-color-mode';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [mode, setMode] = React.useState<Mode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    return saved ?? (systemPrefersDark ? 'dark' : 'light');
  });

  const toggle = React.useCallback(() => {
    setMode((m) => {
      const next = m === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={{ toggle, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
