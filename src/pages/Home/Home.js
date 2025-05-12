import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTanda from '../../assets/logo-tanda-light.png';
import illustration from '../../assets/illustration.png';
import Button from '../../components/ui/Button/Button';
import useTrackPageView from '../../hooks/useTrackPageView';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';

function Home() {
    const navigate = useNavigate();

    useTrackPageView('home');

    return (
        <div className='page'>
            <div className="container home-container">
                <div className="home-content">
                    <div className="home-logo-container">
                        <img src={logoTanda} alt="Tanda Logo" className="home-logo" />
                    </div>

                    <div className="home-hero">
                        <img src={illustration} alt="Ilustración" className="home-illustration" />
                        <p className="home-description">
                            Cambia tus turnos sin perder horas. Publica los que no quieres y consigue los que necesitas
                        </p>
                    </div>

                    <div className="home-body">
                        <div className="btn-group btn-sticky-footer">
                            <Button
                                label="Iniciar sesión"
                                variant="primary"
                                size="lg"
                                onClick={() => {
                                    trackEvent(EVENTS.LOGIN_BUTTON_CLICKED_FROM_HOME);
                                    navigate('/login');
                                }}
                            />
                            <Button
                                label="Registrarme"
                                variant="secondary"
                                size="lg"
                                onClick={() => {
                                    trackEvent(EVENTS.REGISTER_BUTTON_CLICKED_FROM_HOME);
                                    navigate('/register');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;