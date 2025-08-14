import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from '../theme';
export const ColorModeContext = React.createContext({
    toggle: () => { },
    mode: 'light',
});
const STORAGE_KEY = 'mui-color-mode';
export default function AppThemeProvider({ children }) {
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const [mode, setMode] = React.useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
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
    return (_jsx(ColorModeContext.Provider, { value: { toggle, mode }, children: _jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), children] }) }));
}
