import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSentSwaps } from '../services/swapService';
import { useNavigate } from 'react-router-dom';
import '../index.css';


const MySwapsTable = () => {
  const { getToken } = useAuth();
  const [mySwaps, setMySwaps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const token = await getToken();
        const swaps = await getSentSwaps(token);
        const sorted = swaps.sort((a, b) => new Date(a.shift?.date) - new Date(b.shift?.date));
        setMySwaps(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error('❌ Error al cargar swaps enviados:', err.message);
        setError('Error al cargar swaps');
      }
    }
    fetchSwaps();
  }, [getToken]);

  useEffect(() => {
    let result = mySwaps;

    if (filterStatus) {
      result = result.filter(s => s.status === filterStatus);
    }

    if (filterDate) {
      result = result.filter(s => s.shift?.date === filterDate);
    }

    setFiltered(result);
  }, [filterStatus, filterDate, mySwaps]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('');
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="proposed">Propuesto</option>
          <option value="accepted">Aceptado</option>
          <option value="rejected">Rechazado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <button onClick={clearFilters}>Limpiar filtros</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((swap) => (
          <div
            key={swap.swap_id}
            className="my-swap-card"
            onClick={() => navigate(`/swaps/${swap.swap_id}`)}
          >
            <strong>Turno objetivo: {swap.shift?.date} · {swap.shift?.shift_type}</strong>
            <div className="my-swap-meta">
              Con: {swap.shift?.worker?.name} {swap.shift?.worker?.surname}
            </div>
            <div className="my-swap-meta">
              Ofreces: {swap.offered_date || '—'} · {swap.offered_type}
            </div>
            <span className={`swap-status ${swap.status}`}>
              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
            </span>
          </div>
        ))}
      </div>

    </div >
  );
};

export default MySwapsTable;
