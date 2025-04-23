import React from 'react';
import MonthlyCalendar from '../../components/MonthlyCalendar';
import useTrackPageView from '../../hooks/useTrackPageView';
import ProfileButton from '../../components/ProfileButton';


const Calendar = () => {

    useTrackPageView('calendar');

    return (
        <div className="p-4">
            <div className="calendar-header">
                <h1>Mi calendario</h1>
                <ProfileButton />
            </div>
            <MonthlyCalendar />
            <hr />
        </div>
    );
};

export default Calendar;
