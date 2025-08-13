// theme.ts
import { type ThemeOptions } from '@mui/material/styles';
import { type PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#4CAF50' },
          background: { default: '#f0fff4', paper: '#ffffff' },
        }
      : {
          primary: { main: '#4CAF50' },
          background: { default: '#0a2540', paper: '#0f2e55' },
        }),
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});
