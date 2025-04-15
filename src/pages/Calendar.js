import React from 'react';
import MonthlyCalendar from '../components/MonthlyCalendar';
import { useNavigate } from 'react-router-dom';


const Calendar = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Mi calendario</h1>
            <MonthlyCalendar />
            <hr />
            <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default Calendar;
