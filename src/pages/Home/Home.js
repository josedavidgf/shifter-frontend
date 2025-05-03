import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoTanda from '../../assets/logo-tanda-light.png';
import Button from '../../components/ui/Button/Button';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="container home-container">
            <div className="home-content">
                <div className="home-logo-container">
                    <img src={logoTanda} alt="Tanda Logo" className="home-logo" />
                </div>
                <div className="home-body">
                    <div className="home-form">
                        <div className="btn-group">
                            <Button
                                label="Iniciar sesión"
                                variant="primary"
                                size="lg"
                                onClick={() => navigate('/login')}
                            />
                            <Button
                                label="Registrarme"
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate('/register')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Home;
