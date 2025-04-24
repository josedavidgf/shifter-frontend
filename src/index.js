import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';     // 👈 esto sí
import AppWrapper from './components/core/AppWrapper';    // 👈 esto también

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AppWrapper />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
