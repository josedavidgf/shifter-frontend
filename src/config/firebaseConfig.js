// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBV2carSFi6vxr4AmWFYk5N5nVAdLQY79I",
    authDomain: "shifter-4c3af.firebaseapp.com",
    projectId: "shifter-4c3af",
    storageBucket: "shifter-4c3af.firebasestorage.app",
    messagingSenderId: "952306993860",
    appId: "1:952306993860:web:1be07933833a7473f0d791"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
