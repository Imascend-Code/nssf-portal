import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import AppThemeProvider from './providers/AppThemeProvider';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
const qc = new QueryClient();
if (import.meta.env.PROD) {
    // import registers the SW only in prod
    import('./swRegistration');
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(QueryClientProvider, { client: qc, children: _jsx(BrowserRouter, { children: _jsxs(AppThemeProvider, { children: [_jsx(App, {}), _jsx(PWAUpdatePrompt, {})] }) }) }) }));
