import React from 'react';
import MonthlyCalendar from '../../components/MonthlyCalendar';
import useTrackPageView from '../../hooks/useTrackPageView';
//import ProfileButton from '../../components/ProfileButton';
import { UserCircle } from '../../theme/icons';
import { useNavigate } from 'react-router-dom';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';





const Calendar = () => {

    useTrackPageView('calendar');
    const navigate = useNavigate();


    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <>
            <HeaderFirstLevel
                title="Hola"
                rightAction={{
                    icon: <UserCircle size={24} />,
                    onClick: handleProfileClick,
                }}
            />
            <div className="container page">
                <div className="calendar-container">
                    <MonthlyCalendar />
                </div>
            </div>
        </>
    );
};

export default Calendar;
