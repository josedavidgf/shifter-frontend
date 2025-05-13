import React from 'react';
import MonthlyCalendar from '../../components/MonthlyCalendar';
import useTrackPageView, { trackEvent } from '../../hooks/useTrackPageView'; // Importamos trackEvent
import { EVENTS } from '../../utils/amplitudeEvents'; // Importamos los eventos
import { UserCircle } from '../../theme/icons';
import { useNavigate } from 'react-router-dom';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../../components/NotificationBell';
import Loader from '../../components/ui/Loader/Loader';

const Calendar = () => {
    useTrackPageView('calendar');
    const navigate = useNavigate();
    const { isWorker } = useAuth();

    const goToProfile = () => {
        trackEvent(EVENTS.PROFILE_ICON_CLICKED); // Trackeamos el clic en el icono de perfil
        navigate('/profile');
    };

    const goToActivity = () => {
        trackEvent(EVENTS.ACTIVITY_ICON_CLICKED); // Trackeamos el clic en el icono de actividad
        navigate('/activity');
    };

    return (
        <>
            <HeaderFirstLevel
                title={`Hola, ${isWorker?.name || ''}`}
                rightActions={[
                    {
                        icon: <NotificationBell />,
                        onClick: goToActivity,
                    },
                    {
                        icon: <UserCircle size={32} weight="fill" />,
                        onClick: goToProfile,
                    },
                ]}
            />
            <div className="page page-primary">
                <div className="container">
                    {isWorker ? (
                        <MonthlyCalendar />
                    ) : (
                        <Loader text="Cargando tu calendario..." minTime={50} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Calendar;
