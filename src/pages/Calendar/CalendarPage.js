import React from 'react';
import MonthlyCalendar from '../../components/MonthlyCalendar';
import useTrackPageView from '../../hooks/useTrackPageView';


const Calendar = () => {

    useTrackPageView('calendar');
    
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Mi calendario</h1>
            <MonthlyCalendar />
            <hr />
        </div>
    );
};

export default Calendar;
