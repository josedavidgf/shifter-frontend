import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSwapApi } from '../api/useSwapApi';
import { useNavigate } from 'react-router-dom';

const MySwapsTable = () => {
  const { getToken } = useAuth();
  const { getSentSwaps, getReceivedSwaps, loading, error } = useSwapApi(); // 🆕
  const [mySwaps, setMySwaps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const token = await getToken();
        const [sent, received] = await Promise.all([
          getSentSwaps(token),
          getReceivedSwaps(token),
        ]);

        const markedSent = sent.map(s => ({ ...s, direction: 'sent' }));
        const markedReceived = received.map(r => ({ ...r, direction: 'received' }));

        const all = [...markedSent, ...markedReceived];

        const sorted = all.sort((a, b) => new Date(a.shift?.date) - new Date(b.shift?.date));

        setMySwaps(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error('❌ Error al cargar swaps:', err.message);
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

  if (loading) {
    return <p>Cargando intercambios...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <div className="filters-container">
        <div className="filters-group">
          <input
            type="date"
            className="filter-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="proposed">Propuesto</option>
            <option value="accepted">Aceptado</option>
            <option value="rejected">Rechazado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button className="filter-reset" onClick={clearFilters}>Limpiar filtros</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((swap) => (
          <div
            key={swap.swap_id}
            className="my-swap-card"
            onClick={() => navigate(`/swaps/${swap.swap_id}`)}
          >
            <div className="my-swap-meta">
              {swap.direction === 'sent' ? 'Propuesto por ti' : 'Propuesta recibida'}
            </div>
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
