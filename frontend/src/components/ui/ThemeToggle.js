import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ColorModeContext } from '../../providers/AppThemeProvider';
export default function ThemeToggle() {
    const { toggle, mode } = React.useContext(ColorModeContext);
    const isDark = mode === 'dark';
    return (_jsx(Tooltip, { title: isDark ? 'Switch to light mode' : 'Switch to dark mode', children: _jsx(IconButton, { onClick: toggle, "aria-label": "toggle theme", children: isDark ? _jsx(LightModeIcon, {}) : _jsx(DarkModeIcon, {}) }) }));
}
