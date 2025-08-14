export const getDesignTokens = (mode) => ({
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
