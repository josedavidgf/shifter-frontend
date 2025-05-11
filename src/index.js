import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';     // 👈 esto sí
import AppWrapper from './core/AppWrapper';    // 👈 esto también
/* 💅 Estilos globales del sistema DSL */
import './styles/index.css';
import * as Sentry from '@sentry/react';


if (process.env.REACT_APP_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    tracesSampleRate: 0.0,
    environment: 'production',
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Sentry.ErrorBoundary fallback={<p>Algo fue mal. Intenta refrescar la página.</p>}>
                    <AppWrapper />
                </Sentry.ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
