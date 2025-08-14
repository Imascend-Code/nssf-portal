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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AppThemeProvider>
          <App />
          <PWAUpdatePrompt />
        </AppThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
