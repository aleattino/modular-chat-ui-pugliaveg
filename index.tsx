import React from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider } from './contexts/SettingsContext';
import { validateEnv } from './services/validateEnv';

validateEnv();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento root non trovato");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
