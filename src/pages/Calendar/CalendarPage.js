import React from 'react';
import MonthlyCalendar from '../../components/MonthlyCalendar';
import useTrackPageView from '../../hooks/useTrackPageView';
//import ProfileButton from '../../components/ProfileButton';
import { UserCircle } from '../../theme/icons';
import { useNavigate } from 'react-router-dom';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import { useAuth } from '../../context/AuthContext';



const Calendar = () => {

    useTrackPageView('calendar');
    const navigate = useNavigate();
    const { isWorker } = useAuth();



    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <>
            <HeaderFirstLevel
                title={`Hola ${isWorker?.name || ''}`}
                rightAction={{
                    icon: <UserCircle size={32} />,
                    onClick: handleProfileClick,
                }}
            />
            <div className="page page-primary">
                <div className="container">
                    <MonthlyCalendar />
                </div>
            </div>
        </>
    );
};

export default Calendar;
