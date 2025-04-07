import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Bienvenido a Shifter</h1>
            <p>Intercambia turnos de manera sencilla y rápida.</p>
            <nav>
                <Link to="/login">Iniciar Sesión</Link> | 
                <Link to="/register">Registrarse</Link>
            </nav>
        </div>
    );
}

export default Home;
