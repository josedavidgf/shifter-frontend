import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import HeaderSecondLevel from '../components/ui/Header/HeaderSecondLevel';
import MonthSelector from '../components/MonthSelector';
import { ChartPie, Sun, SunHorizon, Moon, Fire } from '../theme/icons';

function computeShiftStats(shiftMap, selectedMonth) {
  const stats = {
    morning: 0,
    evening: 0,
    night: 0,
    reinforcement: 0,
    total: 0,
  };

  for (const [date, entry] of Object.entries(shiftMap)) {
    if (!date.startsWith(selectedMonth)) continue;

    if (entry.shift_type && entry.source !== 'swapped_out') {
      if (stats.hasOwnProperty(entry.shift_type)) {
        stats[entry.shift_type]++;
        stats.total++;
      }
    }
  }

  return stats;
}

function renderShiftIcon(shift) {
  switch (shift) {
    case 'morning':
      return <Sun size={16} />;
    case 'evening':
      return <SunHorizon size={16} />;
    case 'night':
      return <Moon size={16} />;
    case 'reinforcement':
      return <Fire size={16} />;
    case 'total':
      return <ChartPie size={16} />;
    default:
      return null;
  }
}

const Stats = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [shiftMap, setShiftMap] = useState({});

  const stats = useMemo(() => computeShiftStats(shiftMap, selectedMonth), [shiftMap, selectedMonth]);

  return (
    <>
      <HeaderSecondLevel
        title="Turnos y horas"
        showBackButton
        onBack={() => navigate('/')}
      />
      <div className="panel-content">
        <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
        <div className="mt-3 mb-3 p-4 border rounded shadow">
          <div className="badge-container">
            {['total', 'morning', 'evening', 'night', 'reinforcement'].map((type) => {
              const count = stats[type];
              return (
                <div key={type} className="stat-badge">
                  <span className="badge-icon">{renderShiftIcon(type)}</span>
                  <span className="badge-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;