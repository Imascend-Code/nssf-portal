import React from 'react';
type Mode = 'light' | 'dark';
interface ColorModeContextType {
    toggle: () => void;
    mode: Mode;
}
export declare const ColorModeContext: React.Context<ColorModeContextType>;
export default function AppThemeProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
